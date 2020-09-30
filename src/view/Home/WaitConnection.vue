<template>
  <v-row align="center" justify="center">
    <v-col cols="4" class="text-center">
      <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
      ></v-progress-circular>

      <div class="mt-5">{{ `${$t('wait_connection')} ${host}` }}</div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "WaitConnection",
  computed: {
    ...mapState({
      host: state => state.g.host
    })
  },
}
</script>

<style scoped>

</style>

