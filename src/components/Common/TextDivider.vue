<template>
  <v-row align="center">
    <v-divider></v-divider>
    <span class="mx-2 font-weight-bold">{{ text }}</span>
    <slot name="action"></slot>
    <v-divider></v-divider>
  </v-row>
</template>

<script>
export default {
  name: "TextDivider",
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>