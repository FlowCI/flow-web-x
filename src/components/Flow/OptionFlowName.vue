<template>
  <div>
    <v-row>
      <v-col cols="11">
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
                      :loading="loading"
                      :label="isYamlFromRepo ? 'Load from branch' : 'Disabled'"
                      v-model="isYamlFromRepo"
                      @change="onSwitchChange"
            ></v-switch>
          </v-col>

          <v-col cols="5">
            <v-combobox dense
                        outlined
                        class="flow-branch-combo"
                        prepend-icon="mdi-source-branch"
                        :items="gitBranches"
                        :disabled="!isYamlFromRepo"
                        v-model="yamlRepoBranch"
                        @change="onBranchChange"
                        label="branch:">
            </v-combobox>
          </v-col>
        </v-row>
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
    name: 'OptionFlowName',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data () {
      return {
        vars: vars,
        flowNameRules: flowNameRules(this),
        isYamlFromRepo: false,
        yamlRepoBranch: 'master',
        loading: false
      }
    },
    computed: {
      ...mapState({
        gitBranches: state => state.flows.gitBranches
      })
    },
    watch: {
      flow (val) {
        this.isYamlFromRepo = val.yamlFromRepo || false
        this.yamlRepoBranch = val.yamlRepoBranch || 'master'
      }
    },
    methods: {
      onSwitchChange(val) {
        this.updateFlowObj(val, this.yamlRepoBranch)
      },

      onBranchChange(val) {
        this.updateFlowObj(this.isYamlFromRepo, val)
      },

      updateFlowObj(isYamlFromRepo, yamlRepoBranch) {
        const payload = {
          name: this.flow.name,
          isYamlFromRepo,
          yamlRepoBranch
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
