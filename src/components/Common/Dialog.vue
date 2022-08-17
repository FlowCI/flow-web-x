<template>
  <div class="text-xs-center">
    <v-dialog
        v-model="show"
        :width="width"
        @click:outside="onCancel"
    >
      <v-card>
        <v-card-title
            v-if="this.title"
            class="headline"
        >
          {{ this.title }}
        </v-card-title>

        <v-card-text>
          {{ this.content }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn v-if="this.onCancel"
                 small
                 outlined
                 min-width="70"
                 color="warning"
                 @click="onCancel"
          >{{ $t('cancel') }}
          </v-btn>

          <v-btn v-if="this.onConfirm"
                 small
                 class="ml-6"
                 min-width="70"
                 color="primary"
                 @click="onConfirm"
          >{{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    dialog: {
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

    title: {
      type: String,
      required: false
    },

    content: {
      type: String,
      required: false
    },

    onConfirm: {
      type: Function,
      required: false
    },

    onCancel: {
      type: Function,
      required: false
    }
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
  methods: {
  }
}
</script>

<style scoped>

</style>
