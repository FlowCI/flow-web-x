<template>
  <div class="text-select">
    <v-subheader>{{ label }}</v-subheader>
    <v-select :items="items"
              v-model="adaptor"
              :rules="rules"
              item-text="name"
              item-value="value"
              :readonly="readonly"
              @change="onSelectChange"
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
      },
      onChange: {
        type: Function,
        required: false
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
    },
    methods: {
      onSelectChange() {
        if (this.onChange) {
          this.onChange(this.adaptor)
        }
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

    .v-input__slot {
      border: 1px solid #e1e4e8 !important;
      background-color: #fafbfc !important;
      margin-bottom: 0 !important;
      -webkit-box-shadow: inset 0 1px 0 rgba(225,228,232,.2) !important;
      box-shadow: inset 0 1px 0 rgba(225,228,232,.2) !important;
    }

    .v-text-field__details {
      margin-bottom: 0 !important;
    }
  }
</style>
