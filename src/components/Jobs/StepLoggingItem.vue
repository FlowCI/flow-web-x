<template>
  <div class="step-logging-item" @click="onPanelClick">
    <v-expansion-panels
        tile
        multiple
        accordion
        focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <div class="status" :style="{backgroundColor: wrapper.status.config.style.fill}"></div>

            <v-row no-gutters class="ml-4">
              <v-col cols="2">
                <v-icon small>mdi-chevron-right</v-icon>
                <span class="caption ml-2">{{ wrapper.name }}</span>

                <v-tooltip right content-class="body">
                  <template v-slot:activator="{ on }">
                    <v-icon small v-if="wrapper.isSuccessButFailure" v-on="on" class="ml-2">flow-icon-warning</v-icon>
                  </template>
                  <span>allow failure, exit code : {{ wrapper.exitCode }}</span>
                </v-tooltip>

              </v-col>
              <v-col cols="9">
              </v-col>
              <v-col cols="1" class="caption" v-if="wrapper.isFinished">
                <v-btn icon x-small @click="onLogDownload">
                  <v-icon x-small>flow-icon-download</v-icon>
                </v-btn>

                <span class="ml-2">{{ wrapper.duration }}</span>
                <span class="ml-1">s</span>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
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
        required: true,
        type: Object
      }
    },
    data () {
      return {
        terminal: null
      }
    },
    destroyed() {
      if (this.terminal) {
        this.terminal.dispose()
      }
    },
    methods: {
      writeLog(log) {
        if (!this.terminal) {
          return
        }
        console.log(log)
        this.terminal.write(log)
      },

      onLogDownload() {
        this.$store.dispatch(actions.jobs.logs.download, this.wrapper.id).then()
      },

      onPanelClick() {
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

        const fitAddon = new FitAddon();
        this.terminal.loadAddon(fitAddon);

        const unicode11Addon = new Unicode11Addon();
        this.terminal.loadAddon(unicode11Addon);
        this.terminal.unicode.activeVersion = '11';

        this.terminal.open(document.getElementById(`${this.wrapper.id}-terminal`))
        fitAddon.fit();

        this.bus.$on('writeLog', this.writeLog)

        // load logs from server
        if (this.wrapper.isFinished) {
          this.$store.dispatch(actions.jobs.logs.load, this.wrapper.id).then()
        }
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
  }
</style>
