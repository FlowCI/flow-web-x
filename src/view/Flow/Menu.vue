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

    <v-card-text class="px-0">
      <v-treeview
          :dense="true"
          activatable
          hoverable
          item-key="id"
          expand-icon="mdi-chevron-down"
          :items="items"
          :search="search"
          :filter="filter"
          :open.sync="openIds"
          @update:active="onItemClick"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon small v-if="item.children && item.children.length > 0">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>

          <v-icon v-else :color="item.successRateColor">mdi-alpha-f</v-icon>
        </template>

        <template v-slot:label="{ item }">
          <a>{{ item.name }}</a>
        </template>

      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import {getCronDesc} from '@/util/flows'
import {mapState} from 'vuex'
// import FlowCreateDialog from './CreateDialog'
import actions from '@/store/actions'

export default {
  name: 'FlowMenu',
  components: {
    // FlowCreateDialog
  },
  data() {
    return {
      search: null,
      rootItem: {
        id: "root_flow",
        name: "flows",
        open: true,
        children: []
      },
      openIds: [],
      items: [],
      mappingWithId: {},
      mappingWithName: {}
    }
  },
  mounted() {
    this.$store.dispatch(actions.flows.list).then()
  },
  computed: {
    ...mapState({
      flows: state => state.flows.items,
      // to receive job updated event and show latest job status on flow list
      latest: state => state.jobs.latest,
      statsTotal: state => state.stats.statsTotal
    }),

    // current flow name
    current() {
      return this.$route.params.id
    },

    filter () {
      return (item, search, textKey) => (item[textKey] || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1
    },
  },
  watch: {
    flows(items) {
      this.items = [this.rootItem]
      this.rootItem.children = items
      this.openIds = ["root_flow"]

      this.createItemIdNameMapping(items)
      this.fetchLatestStatus(items)
      this.fetchTotalStats(items)
    },

    latest: {
      handler(after) {
        for (let latestJob of after) {
          for (let flow of this.items) {
            if (flow.id === latestJob.flowId) {
              flow.latestJob = latestJob
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    createItemIdNameMapping(items) {
      this.mappingWithId = {}
      this.mappingWithName = {}

      this.mappingWithId[this.rootItem.id] = this.rootItem
      this.mappingWithName[this.rootItem.name] = this.rootItem

      for (let flow of items) {
        this.mappingWithId[flow.id] = flow
        this.mappingWithId[flow.id] = flow
      }
    },

    onItemClick(selection) {
      if (selection.length === 0) {
        // no changes
        return
      }

      const flowId = selection[0]
      if (flowId === "root_flow") {
        return
      }

      const flow = this.mappingWithId[flowId]
      this.$router.push({path: `/flows/${flow.name}/jobs`})
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
      items.forEach((wrapper) => {
        let payload = {name: wrapper.name, metaType: 'default/ci_job_status'}
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

              wrapper.successRate = successPercent
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
      margin-right: 0;
    }

    .v-treeview-node__level {
      width: 16px
    }
  }
}
</style>
