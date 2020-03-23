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

        <!-- step 1: to given a name -->
        <v-stepper-step :complete="step > 1" step="1">
          {{ $t('flow.create_title_name') }}
        </v-stepper-step>
        <v-stepper-content step="1">
          <create-flow-name
              :on-next-click="onNextClick"
          ></create-flow-name>
        </v-stepper-content>

        <!-- step 2: to config git url -->
        <v-stepper-step :complete="step > 2" step="2">
          {{ $t('flow.create_title_git_url') }}
        </v-stepper-step>
        <v-stepper-content step="2">
          <create-config-git
              :webhook="flow.webhook"
              :on-next-click="onNextClick"
              :on-back-click="onBackClick"
              :on-skip-click="onSkipClick"
          ></create-config-git>
        </v-stepper-content>

        <!-- step 3: to config git access -->
        <v-stepper-step :complete="step > 3" step="3">
          {{ $t('flow.create_title_git_access') }}
        </v-stepper-step>
        <v-stepper-content step="3">
          <create-config-access
              :git-url="flow.gitUrl"
              :on-next-click="onNextClick"
              :on-back-click="onBackClick"
          ></create-config-access>
        </v-stepper-content>

        <!-- step 4: to test git access -->
        <v-stepper-step :complete="step > 4" step="4">
          {{ $t('flow.create_title_git_test') }}
        </v-stepper-step>
        <v-stepper-content step="4">
          <create-test-git
              :flow="flow"
              :on-next-click="onNextClick"
              :on-back-click="onBackClick"
          ></create-test-git>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
  import CreateFlowName from '@/components/Flow/CreateFlowName'
  import CreateConfigGit from '@/components/Flow/CreateConfigGit'
  import CreateTestGit from '@/components/Flow/CreateTestGit'
  import CreateConfigAccess from '@/components/Flow/CreateConfigAccess'
  import actions from '@/store/actions'
  import { FlowWrapper } from '@/util/flows'
  import { mapState } from 'vuex'
  import { CATEGORY_AUTH, CATEGORY_SSH_RSA } from '@/util/secrets'

  export default {
    name: 'FlowCreateDialog',
    components: {
      CreateFlowName,
      CreateConfigGit,
      CreateConfigAccess,
      CreateTestGit
    },
    data () {
      return {
        dialog: false,
        step: 1
      }
    },
    computed: {
      ...mapState({
        created: state => state.flows.created
      }),

      flow () {
        if (this.created === undefined) {
          return new FlowWrapper({name: '', variables: {}})
        }

        return new FlowWrapper(this.created)
      }
    },
    watch: {
      step (after) {
        if (after < 5) {
          return
        }

        this.$store.dispatch(actions.flows.confirm, this.flow).then(() => {
          this.onCancelClick()
        })
      }
    },
    methods: {
      onCancelClick () {
        this.dialog = false
        this.step = 1
      },

      onBackClick () {
        if (this.step > 0) {
          this.step--
        }
      },

      onSkipClick () {
        // skip git config
        this.step = 4
      },

      onNextClick (data) {
        this.beforeStepForward(data)
        this.step++
      },

      beforeStepForward (data) {
        const handler = {
          1: (name) => {
            this.flow.name = name
            console.log('flow name: ' + name)
          },
          2: (gitUrl) => {
            this.flow.gitUrl = gitUrl
            console.log('git url: ' + gitUrl)
          },
          3: (credential) => {
            console.log('category: ' + credential.category)
            console.log('selected: ' + credential.selected)

            this.flow.credential = credential.selected
            if (credential.category === CATEGORY_SSH_RSA) {
              this.flow.ssh = credential.pair
            }

            if (credential.category === CATEGORY_AUTH) {
              this.flow.auth = credential.pair
            }
          }
        }

        if (handler[ this.step ]) {
          handler[ this.step ](data)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
