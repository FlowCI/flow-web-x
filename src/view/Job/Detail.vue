<template>
  <div class="job-detail">
    <job-info-bar :wrapper="wrapper"
                  :on-debug-click="onDebugClick"
                  :on-rerun-click="onRerunClick"
                  :on-stop-click="onStopClick"
    ></job-info-bar>

    <v-row v-if="wrapper.errorMsg" no-gutters>
      <v-col>
        <div class="error-message">
          <span class="px-2">{{ wrapper.errorMsg }}</span>
        </div>
      </v-col>
    </v-row>

    <job-tty :job="job" v-model="showTty"></job-tty>

    <v-tabs fixed-tabs
            height="40"
            class="mt-1"
            active-class="tab-active">
      <v-tabs-slider color="#757575"></v-tabs-slider>

      <v-tab href="#summary">
        {{ $t('job.tab.summary') }}
      </v-tab>
      <v-tab href="#context" class="ml-0">
        {{ $t('job.tab.context') }}
      </v-tab>
      <v-tab href="#yml" class="ml-0">
        {{ $t('job.tab.yml') }}
      </v-tab>
      <v-tab v-for="report in reports"
             :key="report.id"
             :href="'#' + report.name">
        {{ report.name }}
      </v-tab>
      <v-tab href="#artifacts" class="ml-0">
        {{ $t('job.tab.artifacts') }}
      </v-tab>

      <v-tab-item value="summary">
        <detail-tab-summary/>
      </v-tab-item>
      <v-tab-item value="context">
        <detail-tab-context :wrapper="wrapper"/>
      </v-tab-item>
      <v-tab-item value="yml">
        <detail-tab-yml :flow="flow" :buildNumber="number"/>
      </v-tab-item>
      <v-tab-item v-for="report in reports"
                  :key="report.id"
                  :value="report.name">
        <detail-html-report :flow="flow"
                            :buildNumber="number"
                            :report="report"
                            v-if="report.contentType.includes('html')"/>
      </v-tab-item>
      <v-tab-item value="artifacts">
        <detail-tab-artifact :flow="flow" :buildNumber="number"/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  import actions from '@/store/actions'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'

  import { JobWrapper } from '@/util/jobs'
  import { icons } from '@/util/agents'
  import { mapState } from 'vuex'

  import DetailTabSummary from '@/view/Job/DetailTabSummary'
  import DetailTabContext from '@/view/Job/DetailTabContext'
  import DetailTabYml from '@/view/Job/DetailTabYml'
  import DetailTabArtifact from '@/view/Job/DetailTabArtifact'
  import DetailHtmlReport from '@/view/Job/DetailHtmlReport'
  import JobInfoBar from './JobInfoBar'
  import JobTty from '@/components/Jobs/TTY'

  export default {
    name: 'JobDetail',
    data() {
      return {
        showTty: false,
        agentIcons: icons,
        duration: '-',
        durationInterval: null,
      }
    },
    components: {
      JobInfoBar,
      DetailTabContext,
      DetailTabSummary,
      DetailTabYml,
      DetailTabArtifact,
      DetailHtmlReport,
      JobTty
    },
    mounted() {
      this.load()
    },
    destroyed() {
      unsubscribeTopic.steps(this.job.id)
      unsubscribeTopic.tasks(this.job.id)
      unsubscribeTopic.logs(this.job.id)
    },
    computed: {
      ...mapState({
        job: state => state.jobs.selected,
        reports: state => state.jobs.reports,
        steps: state => state.steps.items,
      }),

      flow() {
        return this.$route.params.id
      },

      number() {
        return this.$route.params.num
      },

      wrapper() {
        return new JobWrapper(this.job)
      }
    },
    watch: {
      flow() {
        this.load()
      },

      number() {
        this.load()
      },

      // subscribe steps change when job been loaded
      job(obj) {
        subscribeTopic.steps(obj.id, this.$store)
        subscribeTopic.tasks(obj.id, this.$store)
        subscribeTopic.logs(obj.id, this.$store)
      },

      wrapper(w) {
        this.duration = w.duration

        if (this.durationInterval) {
          clearInterval(this.durationInterval)
        }

        if (w.isFinished) {
          return
        }

        this.durationInterval = setInterval(() => {
          this.duration += 1
        }, 1000)
      }
    },
    methods: {
      load() {
        let payload = {flow: this.flow, buildNumber: this.number}
        this.$store.dispatch(actions.jobs.select, payload).then()
        this.$store.dispatch(actions.jobs.steps.get, payload).then()
        this.$store.dispatch(actions.jobs.steps.getTasks, payload).then()
        this.$store.dispatch(actions.jobs.reports.list, payload).then()
      },

      onStopClick() {
        let payload = {flow: this.flow, buildNumber: this.number}
        this.$store.dispatch(actions.jobs.cancel, payload).then()
      },

      onRerunClick() {
        this.$store.dispatch(actions.jobs.rerun, this.job.id)
          .then()
          .catch(reason => {
            console.log(reason)
          })
      },

      onDebugClick() {
        this.showTty = true
      }
    }
  }
</script>

<style lang="scss">
  .job-detail {
    $tab-color: #757575;

    height: 100%;
    position: relative;

    .v-tab {
      margin-left: 0 !important;
      max-width: 300px !important;
      font-weight: bold;
    }

    .tab-active {
      color: $tab-color !important;
    }

    .tab-active::after {
      content: '';
      height: 8px;
      width: 5px;
      bottom: 0;
      position: absolute;
      background-color: $tab-color;
    }
  }
</style>
