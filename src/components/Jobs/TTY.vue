<template>
  <v-overlay :value="value" class="tty">
    <v-card class="full-size">
      <v-card-text>
        <div id="tty-terminal"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onConnectClick" :loading="connecting" class="mr-3">Connect</v-btn>
        <v-btn @click="onCloseClick" :loading="closing" class="mr-10">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
  import actions from '@/store/actions'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import { TTY_ACTION_OPEN, TTY_ACTION_CLOSE, RED, GREEN, END } from '@/util/tty'
  import { Terminal } from "xterm";
  import { FitAddon } from "xterm-addon-fit";

  export default {
    name: "JobTty",
    props: {
      job: {
        type: Object,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      value: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        term: null,
        connecting: false,
        closing: false,
        script: ''
      }
    },
    destroyed() {
      unsubscribeTopic.tty(this.job.id)
    },
    methods: {
      initTerm() {
        if (this.term) {
          this.term.open(document.getElementById("tty-terminal"))
          return
        }

        this.term = new Terminal({
          fontSize: 14,
          cursorStyle: 'bar',
          cursorBlink: true,
          convertEol: true
        })

        const fitAddon = new FitAddon()
        this.term.loadAddon(fitAddon)
        this.term.open(document.getElementById("tty-terminal"))
        fitAddon.fit()

        this.term.attachCustomKeyEventHandler(e => {
          if ((e.metaKey || e.ctrlKey) && (e.key === 'c')) {
            document.execCommand('copy');
            return false;
          }

          if ((e.metaKey || e.ctrlKey) && (e.key === 'v')) {
            navigator.clipboard.readText().then(text => {
              this.onKey(text)
            });
            return false;
          }
        })

        this.term.onKey((event) => {
          this.onKey(event.key)
        });
      },

      onTtyCmdOut(val) {
        if (!val.success) {
          this.writeErrMessage(val.error)
        }

        if (val.action === TTY_ACTION_OPEN) {
          if (val.success) {
            this.writeSuccessMessage('Connected')
          }
          this.connecting = false
          return
        }

        if (val.action === TTY_ACTION_CLOSE) {
          unsubscribeTopic.tty(this.job.id)
          this.$emit('input', false)
          this.closing = false
        }
      },

      onTtyLogOutput(output) {
        this.term.write(output)
      },

      onConnectClick() {
        this.initTerm()
        this.writeSuccessMessage(`Connecting to ${this.path}.....`)

        this.connecting = true
        subscribeTopic.tty(this.job.id, this.onTtyCmdOut, this.onTtyLogOutput)

        this.$store.dispatch(actions.tty.connect, {jobId: this.job.id, nodePath: this.path})
      },

      onKey(input) {
        this.$store.dispatch(actions.tty.shell, {jobId: this.job.id, nodePath: this.path, script: input})
      },

      onCloseClick() {
        this.closing = true
        this.$store.dispatch(actions.tty.close, {jobId: this.job.id, nodePath: this.path})
      },

      writeSuccessMessage(msg) {
        const line = GREEN + msg + END
        this.term.writeln(line)
      },

      writeErrMessage(msg) {
        const line = RED + msg + END
        this.term.writeln(line)
      }
    }
  }
</script>

<style lang="scss">
  .tty {
    .v-overlay__content {
      width: 900px;
      height: 700px;
    }

    .v-card__text {
      height: 650px;
    }

    #tty-terminal {
      overflow: hidden;
      width: 870px;
      height: 640px;
    }
  }
</style>
