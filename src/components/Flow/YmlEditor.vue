<template>
  <div :id="id"></div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  name: "YmlEditor",
  props: {
    id: {
      required: true,
      type: String
    },
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
    this.editor = monaco.editor.create(document.getElementById(this.id), {
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

</style>