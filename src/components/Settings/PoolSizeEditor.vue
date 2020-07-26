<template>
  <v-row>
    <v-col cols="3">
      <v-text-field dense
                    max="50"
                    min="1"
                    step="1"
                    type="number"
                    label="Max Pool Size"
                    v-model="wrapper.maxSize"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'PoolSizeEditor',
    props: {
      wrapper: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
