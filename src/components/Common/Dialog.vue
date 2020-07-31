<template>
  <div class="text-xs-center">
    <v-dialog
        v-model="show"
        :width="width"
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
          <v-btn
              v-if="this.cancelBtn"
              :color="this.cancelBtn.color"
              flat
              @click="onCancelBtnClick"
          >
            {{ this.cancelBtn.text }}
          </v-btn>

          <v-btn
              v-if="this.confirmBtn"
              :color="this.confirmBtn.color"
              flat
              @click="onConfirmBtnClick"
          >
            {{ this.confirmBtn.text }}
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
        default () {
          return 500
        }
      },

      title: {
        type: String,
        required: false
      },

      content: {
        type: String,
        required: true
      },

      /**
       * {
       *   text: 'xxx',
       *   action: function
       *   color: 'xxx'
       * }
       */
      confirmBtn: {
        type: Object,
        required: false
      },

      cancelBtn: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        show: this.dialog
      }
    },
    watch: {
      dialog (newVal) {
        this.show = newVal
      }
    },
    methods: {
      onConfirmBtnClick () {
        if (this.confirmBtn.action) {
          this.confirmBtn.action()
        }
      },

      onCancelBtnClick () {
        if (this.cancelBtn.action) {
          this.cancelBtn.action()
        }
      }
    }
  }
</script>

<style scoped>

</style>
