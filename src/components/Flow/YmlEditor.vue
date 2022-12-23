<template>
  <div id="yml-editor"></div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  name: "YmlEditor",
  props: {
    raw: {
      required: true,
      type: String
    },
    isReadOnly: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      editor: {},
    }
  },
  mounted () {
    this.editor = monaco.editor.create(document.getElementById('yml-editor'), {
      value: this.raw,
      language: 'yaml',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: this.isReadOnly,
      automaticLayout: true,
      theme: 'vs-dark'
    })
  },
}
</script>

<style scoped>
  #yml-editor {
    min-height: 650px;
  }
</style>