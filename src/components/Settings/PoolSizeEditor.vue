<template>
  <v-row>
    <v-col cols="4">
      <v-text-field dense
                    max="50"
                    min="1"
                    step="1"
                    type="number"
                    label="Max Pool Size"
                    v-model="wrapper.maxSize"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field dense
                    max="120"
                    min="5"
                    step="5"
                    type="number"
                    label="Stop agent if it has idle after minutes"
                    v-model="wrapper.maxIdle"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field dense
                    max="120"
                    min="5"
                    step="5"
                    type="number"
                    label="Remove agent if it has been offline after xx minutes"
                    v-model="wrapper.maxOffline"
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