<template>
  <div class="text-select">
    <v-subheader>{{ label }}</v-subheader>
    <v-select :items="items"
              v-model="adaptor"
              :rules="rules"
              item-text="name"
              item-value="value"
              :readonly="readonly"
              dense
              solo
    >
      <template v-slot:selection="{ item }">
        <span class="caption" v-if="util.isObject(item)">
          <v-icon small class="mr-5" v-if="item.icon">{{ item.icon }}</v-icon>
          <span class="caption">{{ item.name }}</span>
        </span>
        <span class="caption" v-if="!util.isObject(item)">{{ item }}</span>
      </template>

      <template v-slot:item="{ item }">
        <span class="caption" v-if="util.isObject(item)">
          <v-icon small class="mr-5" v-if="item.icon">{{ item.icon }}</v-icon>
          <span class="caption">{{ item.name }}</span>
        </span>
        <span class="caption" v-if="!util.isObject(item)">{{ item }}</span>
      </template>
    </v-select>
  </div>
</template>

<script>
  import util from '@/util/common'

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
        util,
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
      max-height: 30px;
      padding: 0;
    }

    .v-input {
      font-size: 12px
    }
  }
</style>
