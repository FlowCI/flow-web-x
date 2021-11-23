<template>
  <textarea class="codemirror" ref="codemirror"></textarea>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/yaml/yaml'

export default {
  name: 'DataEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    mode: {
      type: String,
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
      adaptor: this.value
    }
  },
  mounted() {
    this.instance = CodeMirror.fromTextArea(this.$refs.codemirror, {
      lineNumbers: true,
      mode: this.mode,
      theme: 'base16-light',
      tabSize: 2,
      readOnly: this.isReadOnly
    })

    this.instance.getDoc().setValue(this.adaptor)
    this.instance.on('change', this.onChange)
  },
  watch: {
    adaptor(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onChange(instance, data) {
      this.adaptor = instance.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/base16-light.css';
</style>
