<template>
  <div class="pa-3">
    <v-row align="center" no-gutters>
      <v-col>
        <span class="font-weight-bold title">{{ $t('flow.option_vars_customized') }}</span>
        <v-btn small icon class="ml-2 pb-1" @click="onAddLocalVar" v-if="hasPermission('Admin')">
          <v-icon class="font-weight-bold">mdi-plus-box</v-icon>
        </v-btn>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <env-item :edit="false"
              :flow="flow"
              :obj="obj"
              v-for="(obj, index) in localVars"
              :key="`local-${index}`"
              :editable="obj.editable"
              :onSaved="onVarSaved"
              :onRemoved="onVarRemoved"
              class="my-4"
    ></env-item>

    <v-row>
      <v-col>
        <span class="font-weight-bold title">{{ $t('flow.option_vars_in_yml') }}</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <env-item :edit="false"
              :flow="flow"
              v-for="(obj, index) in ymlVars"
              :key="`yml-${index}`"
              :obj="obj"
              :editable="obj.editable"
              class="my-4"
    ></env-item>

  </div>
</template>

<script>
  import EnvItem from '@/components/Flow/EnvItem'
  import _ from 'lodash'

  export default {
    name: 'SettingsEnvTab',
    components: {
      EnvItem
    },
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data: () => ({
      empty: {
        name: '',
        value: '',
        type: 'STRING',
        edit: true,
        editable: true
      },

      localVars: [],
    }),
    mounted() {
      this.loadLocalVars(this.flow)
    },
    computed: {
      ymlVars() {
        return this.toVarObjectList(this.flow.readOnlyVars, true)
      }
    },
    watch: {
      flow(after) {
        this.loadLocalVars(after)
      }
    },
    methods: {
      loadLocalVars(flow) {
        let permission = this.hasPermission('Admin')

        if (!flow.vars || Object.keys(flow.vars).length === 0) {
          if (permission) {
            const copy = _.cloneDeep(this.empty)
            this.localVars = [copy]
            return
          }
        }

        this.localVars = this.toVarObjectList(flow.vars, !permission)
      },

      toVarObjectList(varsMap, isReadOnly) {
        let list = []

        for (let name in varsMap) {
          let value = varsMap[name]

          if (isReadOnly) {
            list.push({
              name,
              value,
              type: 'STRING',
              edit: false,
              editable: false
            })
            continue
          }

          list.push({
            name,
            value: value.data,
            type: value.type,
            edit: false,
            editable: true
          })
        }

        return list
      },

      onAddLocalVar() {
        const copy = _.cloneDeep(this.empty)
        this.localVars.push(copy)
      },

      onVarSaved(oldVal, newVal) {
      },

      onVarRemoved(val) {
        for (let i = 0; i < this.localVars.length; i++) {
          if (this.localVars[i].name === val.name) {
            this.localVars.splice(i, 1)
            break
          }
        }
      }
    }
  }
</script>

<style scoped>
</style>
