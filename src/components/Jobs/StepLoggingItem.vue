<template>
  <div class="step-logging-item" @click="onPanelClick">
    <v-expansion-panels
        :readonly="!showLog"
        tile
        accordion
        focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <div class="status" :style="{backgroundColor: wrapper.status.config.style.fill}"></div>

            <v-row no-gutters class="ml-4">
              <v-col cols="2">
                <v-icon small v-if="showLog">mdi-chevron-right</v-icon>

                <span :class="['caption', 'ml-2', boldOnName]">{{ wrapper.name }}</span>

                <v-tooltip right content-class="body" v-if="wrapper.isSuccessButFailure">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-2">flow-icon-warning</v-icon>
                  </template>
                  <span>allow failure, exit code : {{ wrapper.exitCode }}</span>
                </v-tooltip>

                <v-tooltip right content-class="body" v-if="wrapper.isTimeoutButAllowFailure">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-2">flow-icon-warning</v-icon>
                  </template>
                  <span>Timeout, but allow failure</span>
                </v-tooltip>

                <v-tooltip right content-class="body" v-if="wrapper.isSkippedOnCondition">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" class="ml-2">flow-icon-warning</v-icon>
                  </template>
                  <span>{{ wrapper.error }}</span>
                </v-tooltip>

              </v-col>
              <v-col cols="8">
              </v-col>
              <v-col cols="2" class="caption" v-if="wrapper.isFinished && showLog">
                <v-btn icon x-small @click="onLogDownload">
                  <v-icon x-small>flow-icon-download</v-icon>
                </v-btn>

                <v-icon class="ml-2" x-small>mdi-clock-outline</v-icon>
                <span class="ml-1">{{ wrapper.duration }}</span>
                <span class="ml-1">s</span>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>

        <v-expansion-panel-content v-if="showLog">
          <div :id="`${wrapper.id}-terminal`" class="terminal"></div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import actions from '@/store/actions'
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Unicode11Addon } from "xterm-addon-unicode11";

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
    },

    boldOnName() {
      if (this.wrapper.isRoot) {
        return 'font-weight-bold'
      }
      return ''
    }
  },
  methods: {
    writeLog(log) {
      if (!this.terminal) {
        return
      }
      this.terminal.write(log)
    },

    onLogDownload() {
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
        rendererType: 'dom',
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
    min-width: 10px;
    max-width: 20px;
    top: 0;
    bottom: 0;
  }

  .v-expansion-panels {
    border-radius: 0;
  }

  .v-expansion-panel-header {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 1px;
    padding-right: 3px;
    min-height: 38px;
  }

  .v-expansion-panel--active
  .v-expansion-panel-header {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 1px;
    padding-right: 3px;
    min-height: 38px;
  }

  .v-expansion-panel-header__icon {
    display: none;
  }

  .v-expansion-panel-content__wrap {
    padding-left: 1px;
    padding-bottom: 0;
    padding-right: 0;
  }

  .terminal {
    height: 300px;
  }
}
</style>
