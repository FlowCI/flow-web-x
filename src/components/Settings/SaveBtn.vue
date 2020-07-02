<template>
  <v-btn color="primary" @click="onClick">
    {{ $t('save') }}<v-icon dark right small>mdi-content-save</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: "SaveBtn",
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
