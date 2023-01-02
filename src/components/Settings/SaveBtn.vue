<template>
  <v-btn color="primary" text @click="onClick" :small="small">
    {{ $t(text) }}<v-icon dark right small>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: "SaveBtn",
    props: {
      onClick: {
        type: Function,
        required: false
      },
      text: {
        type: String,
        required: false,
        default: 'save'
      },
      icon: {
        type: String,
        required: false,
        default: 'mdi-content-save'
      },
      small: {
        type: Boolean,
        required: false,
        default: false
      }
    }
  }
</script>

<style scoped>

</style>
