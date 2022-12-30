<template>
  <div class="text-xs-center">
    <v-dialog
        v-model="value"
        :width="width"
        @click:outside="onCancelClick"
    >
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
          <v-btn color="primary" @click="onCancelClick">{{ $t('cancel') }}</v-btn>
          <v-btn outlined color="error" @click="onConfirmClick">{{ text }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'XDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    width: {
      type: Number,
      required: false,
      default() {
        return 500
      }
    },
    text: {
      type: String,
      required: true
    },
  },
  methods: {
    onCancelClick() {
      this.$emit('input', false)
      this.$emit('cancel')
    },

    onConfirmClick () {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>

</style>
