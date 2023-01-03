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
          <v-btn text :color="cancelBtnColor" @click="onCancelClick">{{ $t('cancel') }}</v-btn>
          <v-btn text :color="confirmBtnColor" @click="onConfirmClick">{{ text }}</v-btn>
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
    cancelBtnColor: {
      type: String,
      required: false,
      default() {
        return 'grey'
      }
    },
    confirmBtnColor: {
      type: String,
      required: false,
      default() {
        return 'primary'
      }
    }
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
