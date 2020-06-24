<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn small outlined v-on="on" block color="primary">
        {{ $t('flow.create') }}
        <v-icon small class="ml-1">flow-icon-control_point</v-icon>
      </v-btn>
    </template>

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
          <create-flow-name :on-next-click="onNextClick"></create-flow-name>
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
          ></create-select-template>
          <span class="error--text" v-if="error">{{ `Error: ${error}` }}</span>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
  import CreateFlowName from './CreateFlowName'
  import CreateSelectTemplate from './CreateSelectTemplate'
  import actions from '@/store/actions'
  import { FlowWrapper } from '@/util/flows'
  import { mapState } from 'vuex'

  export default {
    name: 'FlowCreateDialog',
    components: {
      CreateFlowName,
      CreateSelectTemplate
    },
    data() {
      return {
        dialog: false,
        step: 1,
        error: ''
      }
    },
    computed: {
      ...mapState({
        created: state => state.flows.created
      }),

      flow() {
        if (this.created === undefined) {
          return new FlowWrapper({name: '', variables: {}})
        }

        return new FlowWrapper(this.created)
      }
    },
    methods: {
      onCancelClick() {
        this.dialog = false
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
          2: ({yaml, err}) => {
            if (err) {
              this.error = err
              return
            }

            // send confirm
            let payload = {wrapper: this.flow, yaml};
            this.$store.dispatch(actions.flows.confirm, payload)
                .then(() => {
                  this.onCancelClick()
                })
                .catch((err) => {
                  this.error = err.message
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
