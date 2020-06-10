<template>
  <v-overlay :value="value" class="tty">
    <v-card class="full-size">
      <v-card-text>
        <div id="tty-terminal"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onConnect" class="mr-3">Connect</v-btn>
        <v-btn @click="onClose" class="mr-10">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
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
        term: null
      }
    },
    computed: {
      ...mapState({
        ttyOut: state => state.tty.out,
      }),
    },
    watch: {
      ttyOut(val) {
        console.log(val)
      }
    },
    methods: {
      initTerm() {
        this.term = new Terminal({
          fontSize: 12,
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
            console.log("new line...")
            this.term.writeln("")
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
            this.term.write(event.key);
          }
        });
      },

      onConnect() {
        this.initTerm()
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
