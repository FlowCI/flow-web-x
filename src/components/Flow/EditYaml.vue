<template>
  <v-card flat class="full-size">
    <v-card-text class="editor pa-0">
      <div id="yml-editor" class="full-height"></div>

      <div class="info-message" v-if="flow.yamlFromRepo">
        <span class="px-5 py-1">{{ $t('flow.hint.yaml_from_git', [flow.yamlRepoBranch]) }}</span>
      </div>

      <div class="error-message" v-if="errorOnSave">
        <span class="px-5 py-1">{{ errorOnSave }}</span>
      </div>
    </v-card-text>

    <v-card-actions class="mt-2">
      <v-row>
        <v-col cols="2">
          <a href="https://github.com/FlowCI/templates" target="_blank">{{ $t('flow.more_template') }}</a>
        </v-col>
        <v-col cols="6"/>
        <v-col cols="2">
          <v-btn color="secondary"
                 tile
                 @click="onResetClick"
                 block
                 :disabled="!isCodeChange">
            <b>{{ $t('reset') }}</b>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary"
                 tile
                 @click="onSaveClick"
                 block
                 :disabled="!isCodeChange">
            <b>{{ $t('save') }}</b>
          </v-btn>
        </v-col>
      </v-row>
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
          .then()
          .catch((e) => {
            console.log(e.message)
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
  .editor {
    height: 95%;
  }
</style>
