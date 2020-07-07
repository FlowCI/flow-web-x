<template>
  <div>
    <v-form ref="optionForm" lazy-validation>
      <v-row>
        <v-col cols="10">
          <span class="caption grey--text text--darken-1">{{ `Flow Name (${vars.flow.name})` }}</span>
          <v-text-field
              class="pt-1"
              :rule="flowNameRules"
              v-model="flow.name"
              readonly
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <span class="caption grey--text text--darken-1">Is load YAML from Git (.flowci.yaml)</span>
          <v-row align="center">
            <v-col cols="4">
              <v-switch inset
                        :label="flow.yamlFromRepo ? 'Load from' : 'Disabled'"
                        v-model="flow.yamlFromRepo"
              ></v-switch>
            </v-col>

            <v-col cols="5">
              <v-combobox dense
                          outlined
                          class="flow-branch-combo"
                          prepend-icon="mdi-source-branch"
                          :items="gitBranches"
                          :disabled="!flow.yamlFromRepo"
                          v-model="flow.yamlRepoBranch"
                          label="branch:">
              </v-combobox>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10">
          <span class="caption grey--text text--darken-1">Cron Task</span>
          <v-text-field
              class="pt-1"
              :rules="cronRules"
              v-model="flow.cron"
              clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="5">
          <span class="caption grey--text text--darken-1">Queueing Timeout (seconds)</span>
          <v-text-field
              class="pt-1"
              v-model="flow.jobTimeout"
              type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <span class="caption grey--text text--darken-1">Step Timeout (seconds)</span>
          <v-text-field
              class="pt-1"
              v-model="flow.stepTimeout"
              type="number"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col>
        <v-btn color="success"
               @click="onUpdateClick"
               :loading="loading"
        >Update Settings
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import vars from '@/util/vars'
  import actions from '@/store/actions'
  import { flowNameRules } from '@/util/rules'
  import { mapState } from 'vuex'

  export default {
    name: 'OptionFlowSettings',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        vars: vars,
        flowNameRules: flowNameRules(this),
        cronRules: [
          v => {
            if (!v) {
              return true
            }

            return v.length >= 9 || 'invalid cron format'
          }
        ],
        loading: false
      }
    },
    computed: {
      ...mapState({
        gitBranches: state => state.flows.gitBranches
      })
    },
    methods: {
      onUpdateClick() {
        if (!this.$refs.optionForm.validate()) {
          return
        }

        const payload = {
          name: this.flow.name,
          isYamlFromRepo: this.flow.yamlFromRepo,
          yamlRepoBranch: this.flow.yamlRepoBranch,
          jobTimeout: this.flow.jobTimeout,
          stepTimeout: this.flow.stepTimeout,
          cron: this.flow.cron
        }

        this.loading = true
        this.$store.dispatch(actions.flows.update, payload).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .flow-branch-combo {
    .v-text-field__details {
      display: none;
    }
  }
</style>
