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

    <v-card-text class="px-1">
      <v-treeview
          activatable
          hoverable
          item-key="id"
          :items="items"
          :search="search"
          :filter="filter"
          @update:active="onItemClick"
      >
        <template v-slot:prepend="{ item }">
          <v-icon :color="item.successRateColor">mdi-alpha-f</v-icon>
        </template>

        <template v-slot:label="{ item }">
          <a>{{ item.name }}</a>
        </template>

      </v-treeview>
    </v-card-text>
  </v-card>


<!--  <v-list class="flow-menu">-->


<!--    <v-list-item-group v-model="selected" class="group">-->
<!--      <v-list-item v-for="item in items"-->
<!--                   :key="item.id"-->
<!--                   class="mx-1 mb-2 pa-0 item"-->
<!--                   @click="onItemClick(item)">-->
<!--        <div :class="['status', 'mr-2', item.successRateColor]"></div>-->

<!--        <v-list-item-content>-->
<!--          <v-list-item-title>-->
<!--            <span class="body-2 font-weight-bold">{{ item.name }}</span>-->
<!--            <v-tooltip bottom v-if="item.cron">-->
<!--              <template v-slot:activator="{ on }">-->
<!--                <v-icon small class="mx-1" v-on="on">mdi-alarm</v-icon>-->
<!--              </template>-->
<!--              <span class="caption">{{ item.cron }}</span>-->
<!--              <span class="caption ml-1">({{ getCronDesc(item.cron, $i18n.locale) }})</span>-->
<!--            </v-tooltip>-->
<!--          </v-list-item-title>-->
<!--        </v-list-item-content>-->

<!--        <v-list-item-icon>-->
<!--          <span class="caption">#{{ item.latestJob.buildNumber }}</span>-->
<!--        </v-list-item-icon>-->

<!--        <v-progress-linear-->
<!--            v-if="item.latestJob.isRunning"-->
<!--            :color="item.successRateColor"-->
<!--            buffer-value="100"-->
<!--            height="2"-->
<!--            background-opacity="0.3"-->
<!--            striped-->
<!--            indeterminate-->
<!--            class="progressbar"-->
<!--        ></v-progress-linear>-->
<!--      </v-list-item>-->
<!--    </v-list-item-group>-->

<!--    &lt;!&ndash; button to create&ndash;&gt;-->
<!--    <v-list-item>-->
<!--      <v-list-item-content class="btn-create" v-if="hasPermission('Admin')">-->
<!--        <flow-create-dialog></flow-create-dialog>-->
<!--      </v-list-item-content>-->
<!--    </v-list-item>-->
<!--  </v-list>-->
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
      items: [],
      mapping: {}
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
    }
  },
  watch: {
    flows(items) {
      this.items = items
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
      this.mapping = {}
      for (let flow of items) {
        this.mapping[flow.id] = flow
      }
    },

    onItemClick(selection) {
      if (selection.length === 0) {
        // no changes
        return
      }

      const flowId = selection[0]
      const flow = this.mapping[flowId]
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
}
</style>
