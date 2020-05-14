<template>
  <v-dialog
      v-model="dialog"
      width="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
          outlined
          :class="clazz"
          :color="color"
          v-on="on"
      >{{ text }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title primary-title>
        <slot name="title"></slot>
      </v-card-title>

      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">{{ $t('cancel') }}</v-btn>
        <v-btn outlined color="error" @click="onConfirmClick">{{ text }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "ConfirmBtn",
    props: {
      text: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      clazz: {
        type: [String, Array],
        required: false
      }
    },
    data () {
      return {
        dialog: false
      }
    },
    methods: {
      onConfirmClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>

</style>
