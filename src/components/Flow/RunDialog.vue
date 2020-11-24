<template>
  <v-dialog
      v-model="show"
      persistent
      max-width="750"
      max-height="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          text
          color="success"
          v-on="on"
      >
        <v-icon class="mr-1">mdi-play</v-icon>
        {{ $t('job.run') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline">
        Start a new job
      </v-card-title>

      <v-divider class="mb-1"></v-divider>

      <v-card-text>
        <parameter-item class="my-2"></parameter-item>
        <parameter-item class="my-2"></parameter-item>
        <parameter-item class="my-2"></parameter-item>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="show = false">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="success" @click="show = false">
          {{ $t('job.run') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ParameterItem from "@/components/Flow/ParameterItem"

export default {
  name: "RunDialog",
  components: {
    ParameterItem
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      show: this.dialog
    }
  },
  watch: {
    dialog(newVal) {
      this.show = newVal
    }
  },
}
</script>

<style lang="scss" scoped>

</style>