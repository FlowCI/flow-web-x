<template>
  <div>
    <v-divider></v-divider>

    <v-treeview dense
                ref="tree"
                :items="nodes"
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
      steps: {},
      buses: {},
      openIds: [],
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
  },
  watch: {
    nodes(nodes) {
      this.openIds.length = 0
      this.forEachNodes(nodes, (n) => {
        this.openIds.push(n.pathAsString)
      })
    },

    root(root) {
      this.steps.length = 0

      forEachStep(root, (step) => {
        this.steps[step.path] = step

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
    }
  }
}
</script>

<style lang="scss">

</style>
