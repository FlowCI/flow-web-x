<template>
  <v-card :color="background" elevation="0">
    <v-card-text class="pa-2">
      <span :class="fontcolor">{{ message }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MessageBox",
  props: {
    background: {
      type: String,
      required: false,
      default() {
        return 'red lighten-5'
      }
    },

    fontcolor: {
      type: String,
      required: false,
      default() {
        return 'error--text'
      }
    },

    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>