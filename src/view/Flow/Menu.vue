<template>
  <v-list class="flow-menu">
    <v-subheader class="title">
      <v-text-field
          :placeholder="$t('flow.search')"
          single-line
          append-icon="mdi-magnify"
          v-model="searchVal"/>
    </v-subheader>

    <v-list-item-group v-model="selected" class="group">
      <v-list-item v-for="item in items"
                   :key="item.id"
                   class="mx-1 mb-2 pa-0 item"
                   @click="onItemClick(item)">
        <div :class="['status', 'mr-2', item.successRateColor]"></div>

        <v-list-item-content>
          <v-list-item-title>
            <span class="body-2 font-weight-bold">{{ item.name }}</span>
            <v-tooltip bottom v-if="item.cron">
              <template v-slot:activator="{ on }">
                <v-icon small class="mx-1" v-on="on">mdi-alarm</v-icon>
              </template>
              <span class="caption">{{ item.cron }}</span>
              <span class="caption ml-1">({{ getCronDesc(item.cron, $i18n.locale) }})</span>
            </v-tooltip>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <span class="caption">#{{ item.latestJob.buildNumber }}</span>
        </v-list-item-icon>
      </v-list-item>
    </v-list-item-group>

    <!-- button to create-->
    <v-list-item>
      <v-list-item-content class="btn-create">
        <flow-create-dialog></flow-create-dialog>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import {getCronDesc} from '@/util/flows'
import {mapState} from 'vuex'
import FlowCreateDialog from './CreateDialog'
import actions from '@/store/actions'

export default {
  name: 'FlowMenu',
  components: {
    FlowCreateDialog
  },
  data() {
    return {
      getCronDesc,
      searchVal: '',
      items: [],
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

    selected: {
      get() {
        for (let i = 0; i < this.items.length; i++) {
          const item = this.items[i]
          if (item.name === this.current) {
            return i
          }
        }
        return 0
      },

      set(newValue) {

      }
    }
  },
  watch: {
    flows(items) {
      this.items = items
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

    searchVal(after) {
      this.querySelections(after)
    }
  },
  methods: {
    onItemClick(flow) {
      this.$router.push({path: `/flows/${flow.name}/jobs`})
    },

    querySelections(v) {
      this.items = this.items.filter(e => {
        return (e.name || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
      })
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
  .title {
    max-height: 80px;
    min-height: 80px;
  }

  .status {
    position: relative;
    min-width: 10px;
    max-width: 10px;
    min-height: 50px;
    max-height: 50px;
  }

  .btn-create {
    align-items: center;
  }

  .v-list-item {
    min-height: 50px;
    max-height: 50px;
  }

  .item {
    background: #FFFFFF;
    border-bottom: 1px solid #F5F5F5;
  }

  .v-list-item__icon {
    min-width: 32px !important;
  }
}
</style>
