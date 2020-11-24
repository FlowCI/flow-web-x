<template>
  <v-row no-gutters class="param-item">
    <v-col cols="5">
      <v-text-field
          :label="$t('flow.var_name')"
          append-outer-icon="mdi-equal"
          v-model="item.key"
          solo
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
          v-if="!values"
          class="ml-2"
          :label="$t('flow.var_value')"
          v-model="item.value"
          solo
      ></v-text-field>

      <v-select
          v-if="values"
          :items="values"
          class="ml-2"
          :label="$t('flow.var_value')"
          v-model="item.value"
          solo
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
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
     * indicate show combobox with list of values
     */
    values: {
      type: Array,
      required: false
    }
  }
}
</script>

<style lang="scss">
.param-item {
  .v-input__control {
    min-height: 32px !important;
    max-height: 32px !important;
  }

  .v-input__slot {
    font-size: 14px !important;
  }

  .v-input__append-outer, {
    margin-top: 5px !important;
  }
}
</style>