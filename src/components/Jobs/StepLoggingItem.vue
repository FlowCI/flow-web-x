<template>
  <div class="step-logging-item" @click="onPanelClick">
    <v-expansion-panels
        :readonly="!showLog"
        accordion
        focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <div class="status" :style="{backgroundColor: wrapper.status.config.style.fill}"></div>

            <v-row no-gutters class="ml-4">
              <!-- step name -->
              <v-col cols="5">
                <v-icon small v-if="showLog">mdi-chevron-right</v-icon>

                <span class='subtitle-2 mx-2 font-weight-bold'>{{ wrapper.name }}</span>

                <v-tooltip right content-class="body" v-if="wrapper.isPost">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="mx-1">mdi-flag-outline</v-icon>
                  </template>
                  <span>post step</span>
                </v-tooltip>

                <!-- plugin -->
                <v-tooltip right v-if="wrapper.plugin" class="mx-1">
                  <template v-slot:activator="{ on }">
                    <v-icon small class="ml-1">mdi-view-grid-plus-outline</v-icon>
                  </template>
                  <span>{{ wrapper.plugin }}</span>
                </v-tooltip>

                <!-- dockers -->
                <v-tooltip
                    right
                    v-for="(docker, i) in wrapper.dockers"
                    :key="i"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on"
                            class="ml-1"
                            color="blue lighten-1"
                            text-color="white">mdi-docker</v-icon>
                  </template>
                  <span>{{ docker.image }}</span>
                </v-tooltip>


                <v-tooltip right content-class="body" v-if="wrapper.isSuccessButFailure">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-1">flow-icon-warning</v-icon>
                  </template>
                  <span>allow failure, exit code : {{ wrapper.exitCode }}</span>
                </v-tooltip>

                <v-tooltip right content-class="body" v-if="wrapper.isTimeoutButAllowFailure">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-1">flow-icon-warning</v-icon>
                  </template>
                  <span>Timeout, but allow failure</span>
                </v-tooltip>

                <v-tooltip right content-class="body" v-if="wrapper.isSkippedOnCondition">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-1">flow-icon-warning</v-icon>
                  </template>
                  <span>{{ wrapper.error }}</span>
                </v-tooltip>
              </v-col>

              <!-- blank -->
              <v-col cols="6">
              </v-col>

              <v-col cols="1" class="caption" v-if="wrapper.isRunning && onDebugClick">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn x-small icon @click="onDebugClick(wrapper.path)" v-on="on">
                      <v-icon x-small>mdi-console</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('job.hint.tty') }}</span>
                </v-tooltip>
              </v-col>

              <v-col cols="1" class="caption" v-if="wrapper.isFinished && showLog">
                <v-btn icon x-small @click="onLogDownload" v-if="wrapper.isSuccess">
                  <v-icon small>mdi-download</v-icon>
                </v-btn>

                <v-tooltip bottom v-else-if="wrapper.isFailure">
                  <template v-slot:activator="{ on }">
                    <v-btn icon x-small @click="onRerunClick" v-on="on">
                      <v-icon small>mdi-restart</v-icon>
                    </v-btn>
                  </template>
                  <div>{{ $t('job.hint.rerun_step') }}</div>
                </v-tooltip>

                <v-btn icon x-small v-else>
                  <v-icon small>mdi-minus</v-icon>
                </v-btn>

                <span>
                  <v-icon class="ml-2" x-small>mdi-clock-outline</v-icon>
                  <span class="ml-1">{{ wrapper.duration }}</span>
                  <span class="ml-1">s</span>
                </span>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>

        <v-expansion-panel-content v-if="showLog">
          <div :id="`${wrapper.id}-terminal`" class="logging-term"></div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import actions from '@/store/actions'
import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {Unicode11Addon} from "xterm-addon-unicode11";

export default {
  name: "StepLoggingItem",
  props: {
    wrapper: {
      required: true,
      type: Object
    },
    bus: {
      required: false,
      type: Object
    },
    onDebugClick: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      terminal: null
    }
  },
  mounted() {
    if (this.showLog) {
      this.bus.$on('writeLog', this.writeLog)
    }
  },
  computed: {
    showLog() {
      return !!this.bus && !this.wrapper.children
    }
  },
  methods: {
    writeLog(log) {
      if (!this.terminal) {
        return
      }
      this.terminal.write(log)
    },

    onRerunClick(event) {
      event.stopPropagation()
      this.$store.dispatch(actions.jobs.rerun, {jobId: this.wrapper.jobId, fromFailureStep: true})
          .then()
          .catch(reason => {
            console.log(reason)
          })
    },

    onLogDownload(event) {
      event.stopPropagation()
      this.$store.dispatch(actions.jobs.logs.download, this.wrapper.id).then()
    },

    onLogRead(list) {
      for (let b64 of list) {
        let item = JSON.parse(atob(b64))
        let log = atob(item.content)

        if (this.terminal) {
          this.terminal.write(log)
        }
      }
    },

    onPanelClick() {
      if (!this.showLog) {
        return
      }

      if (this.terminal) {
        return
      }

      this.terminal = new Terminal({
        fontSize: 12,
        disableStdin: true,
        cursorStyle: 'bar',
        convertEol: true,
        theme: {
          background: '#333333',
          foreground: '#f5f5f5'
        }
      })

      let fitAddon = new FitAddon()
      this.terminal.loadAddon(fitAddon)

      const unicode11Addon = new Unicode11Addon()
      this.terminal.loadAddon(unicode11Addon);
      this.terminal.unicode.activeVersion = '11'

      setTimeout(function () {
        this.terminal.open(document.getElementById(`${this.wrapper.id}-terminal`))
        fitAddon.fit()
      }.bind(this), 500);

      // load full logs from server
      if (this.wrapper.isFinished) {
        this.$store.dispatch(actions.jobs.logs.load, this.wrapper.id).then()
        return
      }

      // read existing logs from server
      let payload = {
        stepId: this.wrapper.id,
        onLoaded: this.onLogRead
      }
      this.$store.dispatch(actions.jobs.logs.read, payload).then()
    }
  }
}
</script>

<style lang="scss">
.step-logging-item {
  .status {
    position: absolute;
    min-width: 5px;
    max-width: 5px;
    top: 0;
    bottom: 0;
    left: 0;
  }

  .v-expansion-panels {
    border-radius: 0;
  }

  .v-expansion-panel-header {
    padding: 0 3px 0 1px;
    min-height: 40px;
    max-height: 40px;
  }

  .v-expansion-panel--active
  .v-expansion-panel-header {
    padding: 0 3px 0 1px;
    min-height: 40px;
    max-height: 40px;
  }

  .v-expansion-panel-header__icon {
    display: none;
  }

  .v-expansion-panel-content__wrap {
    padding-left: 1px;
    padding-bottom: 0;
    padding-right: 0;
  }

  .logging-term {
    height: 400px;
    padding: 2px;
    //background: #333333;

    .terminal {
      padding: 5px;
    }
  }
}
</style>
