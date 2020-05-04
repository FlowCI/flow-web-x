<template>
  <div class="env-tab">

    <v-row align="center">
      <v-col class="mb-4">
      <span class="font-weight-light title">Variables
        <v-btn icon @click="onAddLocalVar">
          <v-icon class="font-weight-bold">mdi-plus</v-icon>
        </v-btn>
      </span>
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
    ></env-item>

    <v-row>
      <v-col>
        <span class="font-weight-light title">YAML</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <env-item :edit="false"
              :flow="flow"
              v-for="(obj, index) in ymlVars"
              :key="`yml-${index}`"
              :obj="obj"
              :editable="obj.editable"
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

      localVars: []
    }),
    mounted() {
      this.loadLocalVars(this.flow)
    },
    computed: {
      ymlVars() {
        return this.toVarObjectList(this.flow.variables, false)
      }
    },
    watch: {
      flow(after) {
        this.loadLocalVars(after)
      }
    },
    methods: {
      loadLocalVars(flow) {
        if (!flow.locally || Object.keys(flow.locally).length === 0) {
          const copy = _.cloneDeep(this.empty)
          this.localVars = [copy]
          return
        }

        this.localVars = this.toVarObjectList(flow.locally, false)
      },

      toVarObjectList(varsMap, edit) {
        let list = []

        for (let name in varsMap) {
          let value = varsMap[name]

          if (typeof (value) === 'string') {
            list.push({
              name,
              value,
              type: 'STRING',
              edit: false,
              editable: false
            })
          }

          if (typeof (value) === 'object') {
            list.push({
              name,
              value: value.data,
              type: value.type,
              edit: edit,
              editable: value.editable
            })
          }
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
  .env-tab {
    padding-left: 5px;
    width: 90%;
  }
</style>
