<template>
  <v-card flat>
    <v-card-text class="pa-1">
      <div id="yml-editor"></div>

      <div class="info-message" v-if="flow.yamlFromRepo">
        <span class="px-5 py-1">{{ $t('flow.hint.yaml_from_git', [flow.yamlRepoBranch]) }}</span>
      </div>

      <div class="error-message" v-if="errorOnSave">
        <span class="px-5 py-1">{{ errorOnSave }}</span>
      </div>
    </v-card-text>

    <v-card-actions class="mt-2">
      <a href="https://github.com/FlowCI/templates" target="_blank">{{ $t('flow.more_template') }}</a>

      <v-spacer></v-spacer>

      <v-btn color="secondary"
             tile
             class="action-btn"
             @click="onResetClick"
             :disabled="!isCodeChange">
        {{ $t('reset') }}
      </v-btn>

      <v-btn color="primary"
             tile
             class="action-btn"
             @click="onSaveClick"
             :disabled="!isCodeChange">
        {{ $t('save') }}
      </v-btn>

    </v-card-actions>
  </v-card>
</template>

<script>
  import * as monaco from 'monaco-editor'
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'EditYaml',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data () {
      return {
        editor: {},
        errorOnSave: '',
        isCodeChange: false
      }
    },
    mounted () {
      this.editor = monaco.editor.create(document.getElementById('yml-editor'), {
        value: this.yml,
        language: 'yaml',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        theme: 'vs-dark'
      })

      this.editor.onDidChangeModelContent(this.onCodeChange)

      this.reload()
    },
    computed: {
      ...mapState({
        yml: state => state.flows.selected.yml
      }),

      name () {
        return this.flow.name
      }
    },
    watch: {
      yml (after) {
        this.editor.setValue(after)
      },

      flow () {
        this.reload()
      }
    },
    methods: {
      reload () {
        this.$store.dispatch(actions.flows.yml.load, this.flow.name)
          .then() // handled on watch yml
          .catch((e) => {
            console.log(e.message)
            this.editor.setValue('')
          })
      },

      onCodeChange (e) {
        this.isCodeChange = true
      },

      onResetClick () {
        this.editor.setValue(this.yml)
        this.isCodeChange = false
      },

      onSaveClick () {
        this.errorOnSave = ''

        const payload = {name: this.name, yml: this.editor.getValue()}
        this.$store.dispatch(actions.flows.yml.save, payload)
          .then(() => {
            this.isCodeChange = false

            // reload current flow since vars may changed
            this.$store.dispatch(actions.flows.select, this.name).then()
          })
          .catch((err) => {
            this.errorOnSave = err.message
          })
      }
    }
  }
</script>

<style scoped>
  #yml-editor {
    min-height: 650px;
  }

  .action-btn {
    min-width: 200px !important;
  }
</style>
