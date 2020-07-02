<template>
  <v-btn color="orange darken-2" dark @click="onClick">
    <v-icon dark left small>mdi-arrow-left</v-icon>{{ $t('back') }}
  </v-btn>
</template>

<script>
  export default {
    name: "BackBtn",
    props: {
      onClick: {
        type: Function,
        required: false
      }
    }
  }
</script>

<style scoped>

</style>
