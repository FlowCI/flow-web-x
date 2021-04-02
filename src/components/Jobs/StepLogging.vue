<template>
  <div class="step-logging">
    <v-divider></v-divider>

    <v-treeview dense
                ref="tree"
                :items="nodes"
                @update:open="onTreeExpanded"
                item-key="pathAsString"
                :open.sync="openIds">
      <template v-slot:label={item}>
        <step-logging-item :wrapper="steps[item.pathAsString] || emptyStep"
                           :on-debug-click="onDebugClick"
                           :bus="buses[item.pathAsString]"
        ></step-logging-item>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import Vue from 'vue'
import StepLoggingItem from '@/components/Jobs/StepLoggingItem'
import {EmptyStepWrapper, forEachStep} from '@/util/steps'
import {mapState} from 'vuex'

export default {
  name: 'StepLogging',
  components: {
    StepLoggingItem
  },
  data() {
    return {
      buses: {},
      emptyStep: EmptyStepWrapper
    }
  },
  props: {
    onDebugClick: {
      type: Function,
      required: true
    }
  },
  computed: {
    ...mapState({
      root: state => state.steps.root,
      tasks: state => state.steps.tasks,
      loaded: state => state.logs.loaded,
      pushed: state => state.logs.pushed,
      nodes: state => state.flows.steps
    }),

    openIds: {
      get() {
        let ids = []
        this.forEachNodes(this.nodes, (n) => {
          ids.push(n.pathAsString)
        })
        return ids
      },
      set() {

      }
    },

    steps() {
      let steps = {}
      forEachStep(this.root, (step) => {
        steps[step.path] = step
      })
      return steps
    }
  },
  watch: {
    root(root) {
      forEachStep(root, (step) => {
        if (step.isParallel || step.isStage || step.isFlow) {
          return
        }

        // only init event once, since step-logging-item $on in mounted
        if (!this.buses[step.path]) {
          this.buses[step.path] = new Vue()
        }
      })
    },

    // action from pushed log
    pushed(logWrapper) {
      this.writeLog(logWrapper)
    },

    // action from loaded logs
    loaded(logs) {
      for (let logWrapper of logs) {
        this.writeLog(logWrapper)
      }
    }
  },
  methods: {
    writeLog(logWrapper) {
      let bus = this.buses[logWrapper.cmdId];
      if (bus) {
        bus.$emit("writeLog", logWrapper.log)
      }
    },

    forEachNodes(nodes, onNode) {
      for (let n of nodes) {
        onNode(n)
        this.forEachNodes(n.children, onNode)
      }
    },

    onTreeExpanded() {
      if (this.nodes.length === 0) {
        return
      }

      let children = this.$refs.tree.$el.children
      if (children.length > 0) {
        this.cleanTreeviewElement(children)
        return
      }

      setTimeout(() => {
        this.cleanTreeviewElement(children)
      }, 200)
    },

    cleanTreeviewElement(treeNodes) {
      for (let tn of treeNodes) {
        this.removeNodeLevelOrButtonFromTreeNode(tn)

        let children = this.getChildrenNodes(tn)
        if (children.length > 0) {
          this.cleanTreeviewElement(children)
        }
      }
    },

    removeNodeLevelOrButtonFromTreeNode(treeNodeLeaf) {
      const nodeRoot = treeNodeLeaf.children[0];
      if (!nodeRoot) {
        return
      }

      for (let child of nodeRoot.children) {
        if (this.isToggleBtn(child)) {
          child.remove()
          return
        }
      }

      const first = nodeRoot.children[0]
      if (this.isNodeLevel(first)) {
        first.remove()
      }
    },

    getChildrenNodes(treeNode) {
      if (treeNode.children.length !== 2) {
        return []
      }

      const el = treeNode.children[1]
      if(el.classList.contains('v-treeview-node__children')) {
        return el.children
      }

      return []
    },

    isNodeLevel(el) {
      return el.classList.contains('v-treeview-node__level')
    },

    isToggleBtn(el) {
      return el.classList.contains('v-treeview-node__toggle')
    }
  }
}
</script>

<style lang="scss">
.step-logging {
  .v-treeview-node {
    .v-treeview-node__root {
      padding-left: 0;
    }

    .v-treeview-node__content {
      margin-left: 0;
    }
  }
}
</style>
