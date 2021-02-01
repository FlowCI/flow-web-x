<template>
  <div class="overview">
    <v-row align="center" justify="center" class="full-size" v-if="items.length === 0">
      <v-btn x-large color="info" @click="onCreateFlowClick">{{ $t('flow.create') }}</v-btn>
    </v-row>

    <v-row align="start" justify="start" v-if="items.length > 0">
      <v-col v-for="flow in items"
             :key="flow.name"
             cols="3" md="4" lg="3" sm="2"
      >
        <summary-card :wrapper="flow"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SummaryCard from '@/components/Flow/SummaryCard'
  import { toWrapperList } from '@/util/flows'
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'FlowOverview',
    components: {
      SummaryCard
    },
    data() {
      return {
        items: []
      }
    },
    mounted() {
      this.items = toWrapperList(this.flows)
      this.loadJobStatistic()
      this.setLatestJobs()
    },
    computed: {
      ...mapState({
        flows: state => state.flows.items,
        latest: state => state.jobs.latest,
        statsTotal: state => state.stats.statsTotal
      })
    },
    watch: {
      flows(after) {
        this.items = toWrapperList(after)
        this.loadJobStatistic()
      },

      latest(after) {
        this.setLatestJobs()
      }
    },
    methods: {
      onCreateFlowClick() {
        this.popCreateFlow(true)
      },

      loadJobStatistic() {
        for (let wrapper of this.items) {
          this.fetchTotalStats(wrapper)
        }
      },

      setLatestJobs() {
        for (let wrapper of this.items) {
          for (let latestJob of this.latest) {
            if (wrapper.id === latestJob.flowId) {
              wrapper.latestJob = latestJob
              break
            }
          }
        }
      },

      fetchTotalStats(wrapper) {
        let payload = {name: wrapper.name, metaType: 'default/ci_job_status'}
        this.$store.dispatch(actions.stats.total, payload).then(() => {
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
      }
    }
  }
</script>

<style scoped>
  .overview {
    height: 80vh;
  }
</style>
