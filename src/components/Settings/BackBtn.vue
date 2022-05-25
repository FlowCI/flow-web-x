<template>
  <v-btn color="grey" class="white--text" @click="onClick" :small="small">
    <v-icon left small>{{ icon }}</v-icon>{{ $t(text) }}
  </v-btn>
</template>

<script>
  export default {
    name: "BackBtn",
    props: {
      onClick: {
        type: Function,
        required: false
      },
      text: {
        type: String,
        required: false,
        default: 'back'
      },
      icon: {
        type: String,
        required: false,
        default: 'mdi-arrow-left'
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
