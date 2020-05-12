<template>
  <div class="text-select">
    <v-subheader>{{ label }}</v-subheader>
    <v-select :items="items"
              v-model="adaptor"
              :rules="rules"
              :readonly="readonly"
              dense
              solo
    ></v-select>
  </div>
</template>

<script>
  export default {
    name: "TextSelect",
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: String
      },
      readonly: {
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
      items: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        adaptor: this.value
      }
    },
    watch: {
      adaptor(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss">
  .text-select {
    .v-subheader {
      padding: 0;
    }

    .v-input {
      font-size: 12px
    }
  }
</style>
