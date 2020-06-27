<template>
  <div class="job-detail">
    <v-row align="center" class="grey lighten-5 ma-0 title" no-gutters>
      <v-col cols="2" class="pl-2">
        <span v-bind:class="[wrapper.status.class, 'body-2', 'font-weight-medium']">
          <v-icon small v-bind:class="[wrapper.status.class]">
            {{ wrapper.status.icon }}
          </v-icon>
          {{ wrapper.status.text }}
        </span>
      </v-col>

      <v-col cols="2" class="body-2">
        <div class="pb-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-icon small>mdi-clock-fast</v-icon>
                {{ duration }} sec
              </span>
            </template>
            <span>Ran for {{ duration }} sec</span>
          </v-tooltip>
        </div>

        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-icon small>mdi-clock-outline</v-icon>
                {{ wrapper.finishedAtInStr }}
              </span>
            </template>
            <span>Finished at {{ wrapper.finishedAtInStr }} </span>
          </v-tooltip>
        </div>
      </v-col>

      <v-col cols="2">
        <v-icon small>{{ agentIcons[wrapper.agentInfo.os] }}</v-icon>
        <span class="ml-2 body-2">{{ wrapper.agentInfo.name }}</span>
      </v-col>

      <v-col cols="2">
        <span class="body-2" v-if="wrapper.isYamlFromRepo">
          <div>.flowci.yaml</div>
          <div>from branch {{ wrapper.yamlRepoBranch }}</div>
        </span>
      </v-col>

      <v-col class="body-2" cols="3">
        <div class="pb-2">{{ $t('job.triggerBy') }}</div>
        <div>
          <span>{{ wrapper.triggerBy }}</span>
          <v-icon small class="ml-2">{{ wrapper.triggerIcon }}</v-icon>
        </div>
      </v-col>

      <v-col cols="1">
        <v-tooltip bottom v-if="!wrapper.isFinished">
          <template v-slot:activator="{ on }">
            <v-btn icon color="black" @click="onDebugClick" v-on="on">
              <v-icon>mdi-console</v-icon>
            </v-btn>
          </template>
          <span class="body-2">{{ $t('job.hint.tty') }}</span>
        </v-tooltip>

        <v-btn icon color="error" @click="onStopClick" v-if="!wrapper.isFinished">
          <v-icon>mdi-stop</v-icon>
        </v-btn>

        <v-btn icon @click="onRerunClick" v-if="wrapper.isFinished">
          <v-icon>mdi-restart</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="ma-0 info">
      <v-col class="pa-0">
        <v-divider></v-divider>
        <div class="error-message" v-if="wrapper.errorMsg">
          <span class="px-5 py-1">{{ wrapper.errorMsg }}</span>
        </div>
      </v-col>
    </v-row>

    <job-tty :job="job" v-model="showTty"></job-tty>

    <v-tabs fixed-tabs class="mt-1 tab-wrapper">
      <v-tab href="#summary" class="ml-0 elevation-1">
        {{ $t('job.tab.summary') }}
      </v-tab>
      <v-tab href="#context" class="ml-0 elevation-1">
        {{ $t('job.tab.context') }}
      </v-tab>
      <v-tab href="#yml" class="ml-0 elevation-1">
        {{ $t('job.tab.yml') }}
      </v-tab>
      <v-tab v-for="report in reports"
             :key="report.id"
             :href="'#' + report.name">
        {{ report.name }}
      </v-tab>
      <v-tab href="#artifacts" class="ml-0 elevation-1">
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
    height: 100%;
    position: relative;
    overflow: auto;

    .title {
      height: 14%;
    }

    .tab-wrapper {
      height: 85%;

      .v-tabs-bar {
        height: 6%;
      }

      .v-window {
        height: 93%;
      }

      .v-window__container {
        height: 99%;
      }

      .v-window-item {
        height: 99%;
      }
    }
  }
</style>
