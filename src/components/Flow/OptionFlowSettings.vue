<template>
  <div>
    <v-form ref="optionForm" lazy-validation>
      <v-row>

        <!-- flow name -->
        <v-col cols="10">
          <span class="caption grey--text text--darken-1">
            {{ $t('flow.flow_name') }} {{ ` (${vars.flow.name})` }}
          </span>
          <v-text-field
              class="pt-1"
              :rule="flowNameRules"
              v-model="flow.name"
              readonly
          ></v-text-field>
        </v-col>

        <!-- git yaml-->
        <v-col cols="10">
          <span class="caption grey--text text--darken-1">
            {{ $t('flow.git_yaml') }}
          </span>
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

        <!-- cron task -->
        <v-col cols="10">
          <span class="caption grey--text text--darken-1">
            {{ $t('flow.cron_task') }}
            <span v-if="cronDesc">{{ `(${cronDesc})` }}</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon small class="mx-1" v-on="on">mdi-help-circle-outline</v-icon>
              </template>
              <span>&lt;minute&gt; &lt;hour&gt; &lt;day-of-month&gt; &lt;month&gt; &lt;day-of-week&gt;</span>
            </v-tooltip>
          </span>
          <v-text-field
              class="pt-1"
              :rules="cronRules"
              v-model="flow.cron"
              clearable
          ></v-text-field>
        </v-col>

        <!-- timeout -->
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

        <!-- error -->
        <v-col v-if="error" cols="10">
          <span class="error--text">{{ error }}</span>
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
  import { getCronDesc } from '@/util/flows'
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
        error: '',
        cronRules: [
          v => {
            if (!v) {
              return true
            }

            const min = /^(\*|[1-5]?[0-9](-[1-5]?[0-9])?)(\/[1-9][0-9]*)?(,(\*|[1-5]?[0-9](-[1-5]?[0-9])?)(\/[1-9][0-9]*)?)*$/
            const hour = /^(\*|(1?[0-9]|2[0-3])(-(1?[0-9]|2[0-3]))?)(\/[1-9][0-9]*)?(,(\*|(1?[0-9]|2[0-3])(-(1?[0-9]|2[0-3]))?)(\/[1-9][0-9]*)?)*$/
            const monthDay = /^(\*|([1-9]|[1-2][0-9]?|3[0-1])(-([1-9]|[1-2][0-9]?|3[0-1]))?)(\/[1-9][0-9]*)?(,(\*|([1-9]|[1-2][0-9]?|3[0-1])(-([1-9]|[1-2][0-9]?|3[0-1]))?)(\/[1-9][0-9]*)?)*$/
            const month = /^(\*|([1-9]|1[0-2]?)(-([1-9]|1[0-2]?))?)(\/[1-9][0-9]*)?(,(\*|([1-9]|1[0-2]?)(-([1-9]|1[0-2]?))?)(\/[1-9][0-9]*)?)*$/
            const weekDay = /^(\*|[0-6](-[0-6])?)(\/[1-9][0-9]*)?(,(\*|[0-6](-[0-6])?)(\/[1-9][0-9]*)?)*$/

            const validator = [
              (item) => {
                return min.test(item)
              },
              (item) => {
                return hour.test(item)
              },
              (item) => {
                return monthDay.test(item)
              },
              (item) => {
                return month.test(item)
              },
              (item) => {
                return weekDay.test(item)
              },
            ]

            let items = v.split(" ");
            if (items.length !== 5) {
              return 'invalid cron format'
            }

            for (let index in items) {
              if (!validator[index](items[index])) {
                return 'invalid cron format'
              }
            }

            return true
          }
        ],
        loading: false
      }
    },
    computed: {
      ...mapState({
        gitBranches: state => state.flows.gitBranches
      }),

      cronDesc() {
        return getCronDesc(this.flow.cron, this.$i18n.locale)
      }
    },
    methods: {
      onUpdateClick() {
        this.error = ''

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
        }).catch((e) => {
          this.loading = false
          this.error = e.message
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
