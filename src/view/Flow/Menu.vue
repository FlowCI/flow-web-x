<template>
  <v-card class="elevation-0 flow-menu">
    <v-sheet class="pa-3 grey lighten-3">
      <v-text-field
          v-model="search"
          :label="$t('flow.search')"
          flat
          solo
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>

    <v-card-title>
      <a>flows</a>
      <v-spacer></v-spacer>
      <v-menu bottom
              offset-y
              rounded
              v-if="hasPermission('Admin')"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              dark
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon color="primary">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item link @click="onCreateFlow()">
            <v-list-item-icon class="mr-1">
              <v-icon>mdi-alpha-f</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="ml-1">
              <v-list-item-title v-text="$t('flow.create')"></v-list-item-title>
            </v-list-item-title>
          </v-list-item>

          <v-list-item link @click="onCreateGroup()">
            <v-list-item-icon class="mx-1">
              <v-icon small>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <v-list-item-title v-text="$t('flow.create_group')"></v-list-item-title>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text class="px-0">
      <v-treeview
          :dense="true"
          activatable
          hoverable
          item-key="id"
          expand-icon="mdi-chevron-down"
          :items="tree"
          :search="search"
          :filter="filter"
          :open.sync="openIds"
          :active.sync="activeIds"
          @update:active="onItemClick"
      >
        <template v-slot:label="{ item, open }">
          <div draggable="true"
               @dragstart="onItemDragStart"
               @drop="onItemDrop"
               @dragenter.prevent
               @dragover.prevent
               :id="item.id"
          >
            <v-icon small v-if="item.type === 'Group'" class="ml-1">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else :color="item.successRateColor">mdi-alpha-f</v-icon>

            <a class="ml-2">{{ item.name }}</a>
            <v-icon class="float-right">mdi-drag</v-icon>
          </div>
        </template>
      </v-treeview>
    </v-card-text>

    <flow-group-action-dialog title="Moving"
                              :content="groupActionContent"
                              :dialog="showGroupActionDialog"
                              :on-confirm="onFlowMovingActionConfirm"
                              :on-cancel="onFlowMovingActionCancel"
    ></flow-group-action-dialog>
  </v-card>
</template>

<script>
import {mapState} from 'vuex'
import actions from '@/store/actions'
import FlowGroupActionDialog from '@/components/Common/Dialog'

export default {
  name: 'FlowMenu',
  components: {
    FlowGroupActionDialog
  },
  data() {
    return {
      showGroupActionDialog: false,
      groupActionContent: '',
      search: null,
      openIds: [],
      activeIds: [],
      tree: [],
      showMenu: false,
      dragStartId: '',
      dropTargetId: ''
    }
  },
  mounted() {
    this.$store.dispatch(actions.flowItems.list).then()
  },
  computed: {
    ...mapState({
      flowItems: state => state.flowItems.items,
      mappingWithId: state => state.flowItems.mappingWithId,
      mappingWithName: state => state.flowItems.mappingWithName,
      // to receive job updated event and show the latest job status on flow list
      latest: state => state.jobs.latest,
      statsTotal: state => state.stats.statsTotal
    }),

    // current flow name
    current() {
      return this.$route.params.id
    },

    filter() {
      return (item, search, textKey) => (item[textKey] || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1
    },
  },
  watch: {
    flowItems(items) {
      this.tree = this.createTreeFromItems(items)

      this.fetchLatestStatus(items)
      this.fetchTotalStats(items)

      this.openIds = []
      this.activeIds = []
      if (this.current && this.mappingWithName[this.current]) {
        this.activeIds.push(this.mappingWithName[this.current].id)
      }
    },

    latest: {
      handler(after) {
        for (let latestJob of after) {
          const flow = this.mappingWithId[latestJob.flowId]
          if (flow && flow.type === 'Flow') {
            flow.latestJob = latestJob
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    createTreeFromItems(wrapperItems) {
      let groups = {}
      let flows = {}

      for (let item of wrapperItems) {
        if (item.type === 'Group') {
          groups[item.id] = item
          continue
        }

        if (item.type === 'Flow') {
          if (item.parentId) {
            groups[item.parentId].children.push(item)
            continue
          }

          flows[item.id] = item
        }
      }

      let tree = []
      for (const [key, value] of Object.entries(groups)) {
        tree.push(value)
      }

      for (const [key, value] of Object.entries(flows)) {
        tree.push(value)
      }

      return tree
    },

    onItemDragStart(event) {
      if (event.target.id) {
        this.dragStartId = event.target.id
      }
    },

    onItemDrop(event) {
      if (event.target.id) {
        this.dragEndId = event.target.id
      }

      const srcItem = this.mappingWithId[this.dragStartId]
      const targetItem = this.mappingWithId[this.dragEndId]

      if (!srcItem || !targetItem) {
        return
      }

      if (srcItem.type === 'Flow' && targetItem.type === 'Group') {
        console.log('will move into the group ' + targetItem.name)
        this.groupActionContent = `Do you want to move the flow ${srcItem.name} to the group ${targetItem.name} ?`
        this.showGroupActionDialog = true
      }
    },

    onItemClick(selection) {
      if (selection.length === 0) {
        // no changes
        return
      }

      const flowId = selection[0]
      const flow = this.mappingWithId[flowId]
      if (this.current === flow.name) {
        return
      }

      if (flow.type === 'Group') {
        return
      }

      this.$router.push({path: `/flows/${flow.name}/jobs`})
    },

    onFlowMovingActionConfirm() {

    },

    onFlowMovingActionCancel() {
      this.showGroupActionDialog = false
    },

    onCreateGroup() {
      this.popCreateGroup(true)
    },

    onCreateFlow() {
      this.popCreateFlow(true)
    },

    fetchLatestStatus(items) {
      items.forEach((wrapper) => {
        this.$store.dispatch(actions.jobs.latest, wrapper.name)
            .then(() => {
              for (let latest of this.latest) {
                if (latest.flowId === wrapper.id) {
                  wrapper.latestJob = latest
                  break
                }
              }
            })
            .catch((e) => {
            })
      })
    },

    fetchTotalStats(items) {
      items.forEach((item) => {
        let payload = {name: item.name, metaType: 'default/ci_job_status'}
        this.$store.dispatch(actions.stats.total, payload)
            .then(() => {
              let sum = 0.0
              let total = this.statsTotal

              for (const category of Object.keys(total.counter)) {
                sum += total.counter[category]
              }

              let numOfSuccess = total.counter['SUCCESS']
              let successPercent = (numOfSuccess / sum) * 100
              successPercent = successPercent.toFixed(0)
              item.successRate = successPercent
            })
            .catch((e) => {
            })
      })
    }
  }
}
</script>

<style lang="scss">
.flow-menu {

  .btn-create {
    align-items: center;
  }

  .progressbar {
    position: absolute;
    top: 49px;
    bottom: 0;
  }

  .v-treeview-node__root {
    .v-treeview-node__toggle {
      width: 18px;
      height: 18px;
    }

    .v-treeview-node__prepend {
      .v-icon {
        font-size: 20px;
      }
    }

    .v-treeview-node__level {
      width: 16px
    }
  }
}
</style>
