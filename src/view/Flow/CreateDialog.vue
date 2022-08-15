<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <!-- toolbar -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="onCancelClick">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('flow.create') }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- content -->
      <v-stepper v-model="step" vertical>

        <!-- step 1: given a name -->
        <v-stepper-step :complete="step > 1" step="1">
          {{ $t('flow.create_title_name') }}
        </v-stepper-step>
        <v-stepper-content step="1">
          <input-flow-name :on-next-click="onNextClick"></input-flow-name>
        </v-stepper-content>

        <!-- step 2:  select a template -->
        <v-stepper-step :complete="step > 2" step="2">
          {{ $t('flow.create_title_select_template') }}
        </v-stepper-step>
        <v-stepper-content step="2">
          <create-select-template
              class="ml-2"
              :on-back-click="onBackClick"
              :on-next-click="onNextClick"
              :loading="loading"
          ></create-select-template>
          <span class="error--text" v-if="error">{{ `Error: ${error}` }}</span>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
  import InputFlowName from './InputFlowName'
  import CreateSelectTemplate from './CreateSelectTemplate'
  import actions from '@/store/actions'
  import { FlowWrapper } from '@/util/flows'
  import { mapState } from 'vuex'

  export default {
    name: 'CreateFlowDialog',
    components: {
      InputFlowName,
      CreateSelectTemplate
    },
    data() {
      return {
        step: 1,
        error: '',
        loading: false
      }
    },
    computed: {
      ...mapState({
        showCreateFlow: state => state.g.showCreateFlow,
        created: state => state.flows.created
      }),

      dialog: {
        get() {
          return this.showCreateFlow
        },

        set(val) {
          this.popCreateFlow(val)
        }
      },

      flow() {
        if (this.created === undefined) {
          return new FlowWrapper({name: '', variables: {}})
        }

        return new FlowWrapper(this.created)
      }
    },
    methods: {
      onCancelClick() {
        this.popCreateFlow(false)
        this.step = 1
        this.error = ''
      },

      onBackClick() {
        if (this.step > 0) {
          this.step--
          this.error = ''
        }
      },

      onNextClick(data) {
        const handler = {
          // step 1
          1: (name) => {
            this.flow.name = name
            console.log('flow name: ' + name)
            this.step++
          },

          // step 2
          2: (title) => {
            // send confirm
            this.loading = true
            let payload = {wrapper: this.flow, title}
            this.$store.dispatch(actions.flows.create, payload)
                .then(() => {
                  this.onCancelClick()
                  this.loading = false
                })
                .catch((err) => {
                  this.error = err.message
                  this.loading = false
                })
          }
        }

        if (handler[this.step]) {
          handler[this.step](data)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
