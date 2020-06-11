<template>
  <v-overlay :value="value" class="tty">
    <v-card class="full-size">
      <v-card-text>
        <div id="tty-terminal"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onConnect" :loading="connecting" class="mr-3">Connect</v-btn>
        <v-btn @click="onClose" class="mr-10">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
  import actions from '@/store/actions'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import { TTY_ACTION_OPEN, TTY_ACTION_CLOSE } from '@/util/tty'
  import { mapState } from "vuex";
  import { Terminal } from "xterm";
  import { FitAddon } from "xterm-addon-fit";

  export default {
    name: "JobTty",
    props: {
      job: {
        type: Object,
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
        script: ''
      }
    },
    computed: {
      ...mapState({
        ttyOut: state => state.tty.out,
        ttyLog: state => state.tty.log,
      }),
    },
    watch: {
      ttyOut(val) {
        console.log(val)

        if (val.action === TTY_ACTION_OPEN) {
          if (val.success) {
            this.connecting = false
          }
        }
      },

      ttyLog(val) {
        this.term.write(val);
      }
    },
    methods: {
      initTerm() {
        this.term = new Terminal({
          fontSize: 14,
          cursorStyle: 'bar',
          convertEol: true
        })

        const fitAddon = new FitAddon()
        this.term.loadAddon(fitAddon)
        this.term.open(document.getElementById("tty-terminal"))
        fitAddon.fit()

        this.term.onKey((event) => {
          const ev = event.domEvent;
          const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

          if (ev.keyCode === 13) {
            this.onEnter(this.script)
            this.script = ''
            this.term.writeln('')
            return
          }

          if (ev.keyCode === 8) {
            // Do not delete the prompt
            if (this.term._core.buffer.x > 2) {
              this.term.write('\b \b');
            }
            return
          }

          if (printable) {
            this.script = this.script.concat(event.key)
            this.term.write(event.key);
          }
        });
      },

      onConnect() {
        this.initTerm()
        this.connecting = true
        subscribeTopic.tty(this.job.id, this.$store)
        this.$store.dispatch(actions.tty.connect, this.job.id)
      },

      onEnter(script) {
        this.$store.dispatch(actions.tty.shell, {jobId: this.job.id, script: script})
      },

      onClose() {
        this.$emit('input', false)
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
