<template>
  <div class="text-box">
    <v-subheader>
      <span>{{ label }}</span>
      <span v-if="desc" class="ml-2">({{ desc }})</span>
    </v-subheader>
    <v-text-field
        solo
        dense
        :disabled="disable"
        :readonly="readonly"
        v-model="adaptor"
        :rules="rules"
        :type="realType"
        :prepend-inner-icon="prependInnerIcon"
        :append-icon="isPassword ? (showPassword ? 'mdi-eye' : 'mdi-eye-off') : ''"
        @click:append="showPassword = !showPassword"
        @blur="onBlurEvent"
        @focus="onFocusEvent"
        class="append-icon-small prepend-icon-small"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'TextBox',
  props: {
    label: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: false
    },
    value: {
      type: [Number, String]
    },
    prependInnerIcon: {
      type: String,
      required: false,
      default: ''
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    rules: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      adaptor: this.value,
      showPassword: false,
      focusClass: ''
    }
  },
  computed: {
    isPassword() {
      return this.type === 'password'
    },

    realType() {
      if (this.type === 'password') {
        return this.showPassword ? 'text' : 'password'
      }
      return this.type
    }
  },
  watch: {
    value(val) {
      this.adaptor = val
    },

    adaptor(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onFocusEvent(event) {
      if (this.readonly) {
        return
      }
      let inputSlotElem = event.path[2]
      inputSlotElem.classList.add("input-focus");
    },

    onBlurEvent(event) {
      if (this.readonly) {
        return
      }
      let inputSlotElem = event.path[2]
      inputSlotElem.classList.remove("input-focus");
    }
  }
}
</script>

<style lang="scss">
.text-box {
  .v-subheader {
    max-height: 30px;
    padding: 0;
  }

  .v-input {
    font-size: 14px
  }

  .v-input__slot {
    border: 1px solid #e1e4e8 !important;
    background-color: #fafbfc !important;
    margin-bottom: 0 !important;
    -webkit-box-shadow: inset 0 1px 0 rgba(225, 228, 232, .2) !important;
    box-shadow: inset 0 1px 0 rgba(225, 228, 232, .2) !important;
  }

  .input-focus {
    background-color: white !important;
    border: 1px solid #64B5F6 !important;
    -webkit-box-shadow: inset 0 1px 0 rgba(180, 206, 241, 1) !important;
    box-shadow: 0 0 6px rgb(180, 206, 241, 1) !important;
  }

  .v-text-field__details {
    margin-bottom: 0 !important;
  }

  .v-input--is-disabled {
    .v-input__slot {
      border: 1px solid #BDBDBD !important;
    }
  }
}
</style>
