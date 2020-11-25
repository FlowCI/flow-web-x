<template>
  <v-row no-gutters class="param-item">
    <v-col cols="5">
      <v-text-field
          :label="$t('flow.var_name')"
          append-outer-icon="mdi-equal"
          v-model="item.key"
          :readonly="readonly.key"
          :rules="required"
          solo
      ></v-text-field>
    </v-col>

    <v-col cols="6">
      <v-text-field
          v-if="!values"
          class="ml-2"
          :label="$t('flow.var_value')"
          v-model="item.value"
          :readonly="readonly.value"
          :rules="required"
          solo
      ></v-text-field>
      <v-select
          v-if="values"
          :items="values"
          class="ml-2"
          :label="$t('flow.var_value')"
          v-model="item.value"
          :readonly="readonly.value"
          solo
      ></v-select>
    </v-col>

    <v-col cols="1">
      <slot name="action"></slot>
    </v-col>
  </v-row>
</template>

<script>
import { required } from '@/util/rules'

export default {
  name: "ParameterItem",
  props: {
    /**
     * {key: xx, value: xx}
     */
    item: {
      type: Object,
      required: true
    },

    /**
     * {key: true, value: true}
     */
    readonly: {
      type: Object,
      required: false,
      default() {
        return {
          key: false,
          value: false
        }
      }
    },

    /**
     * indicate show combobox with list of values
     */
    values: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      required: required('required')
    }
  }
}
</script>

<style lang="scss">
.param-item {
  .v-input__control {
    min-height: 32px !important;
  }

  .v-input__slot {
    font-size: 14px !important;
    margin-bottom: 2px !important;
  }

  .v-text-field__details {
    margin-bottom: 2px !important;
  }

  .v-input__append-outer, {
    margin-top: 5px !important;
  }
}
</style>