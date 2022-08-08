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
          :items="items"
          :search="search"
          :filter="filter"
          :open.sync="openIds"
          :active.sync="activeIds"
          @update:active="onItemClick"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children && item.children.length > 0">
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
import {mapState} from 'vuex'
import actions from '@/store/actions'

export default {
  name: 'FlowMenu',
  data() {
    return {
      search: null,
      openIds: [],
      activeIds: [],
      items: [],
      showMenu: false,
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

    filter() {
      return (item, search, textKey) => (item[textKey] || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1
    },
  },
  watch: {
    flows(items) {
      this.items = items

      this.createItemIdNameMapping(items)
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

      for (let flow of items) {
        this.mappingWithId[flow.id] = flow
        this.mappingWithName[flow.name] = flow
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

    onCreateGroup() {

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
