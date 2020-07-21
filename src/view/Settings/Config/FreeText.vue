<template>
  <v-textarea
      outlined
      rows="20"
      label="Input free text"
      v-model="config.text"
  ></v-textarea>
</template>

<script>
  export default {
    name: "SettingsConfigFreeText",
    props: {
      config: {
        required: true,
        type: Object
      }
    },
  }
</script>

<style scoped>

</style>
