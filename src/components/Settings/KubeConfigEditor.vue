<template>
  <textarea class="codemirror" ref="codemirror"></textarea>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/yaml/yaml'

export default {
  name: 'KubeConfigEditor',
  props: {
    /**
     * Ex: {
     *   content: {
     *     data: 'xxx',
     *   }
     * }
     */
    model: {
      type: Object,
      required: true
    },
    isReadOnly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      CodeMirror,
      instance: null,
    }
  },
  mounted() {
    this.instance = CodeMirror.fromTextArea(this.$refs.codemirror, {
      lineNumbers: true,
      mode: 'yaml',
      theme: 'base16-light',
      tabSize: 2,
      readOnly: this.isReadOnly
    })

    console.log(this.model.content.data)

    this.instance.getDoc().setValue(this.model.content.data)
    this.instance.on('change', this.onChange)
  },
  methods: {
    onChange(instance, data) {
      this.model.content.data = instance.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/base16-light.css';
</style>
