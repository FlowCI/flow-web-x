<template>
  <div id="yml-editor"></div>
</template>

<script>
  import * as monaco from 'monaco-editor'
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'DetailTabYml',
    props: {
      flow: {
        type: String,
        required: true
      },
      buildNumber: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        editor: {}
      }
    },
    mounted () {
      this.editor = monaco.editor.create(document.getElementById('yml-editor'), {
        value: this.yml,
        language: 'yaml',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: true,
        automaticLayout: true,
        theme: 'vs-dark'
      })

      this.$store.dispatch(actions.jobs.getYml, {flow: this.flow, buildNumber: this.buildNumber}).then()
    },

    computed: {
      ...mapState({
        yml: state => state.jobs.yml
      })
    },
    watch: {
      yml (newValue) {
        this.editor.setValue(newValue)
      }
    }
  }
</script>

<style scoped>
  #yml-editor {
    height: 580px;
  }
</style>
