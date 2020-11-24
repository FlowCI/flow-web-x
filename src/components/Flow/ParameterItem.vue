<template>
  <v-row no-gutters class="param-item">
    <v-col cols="5">
      <v-text-field
          :label="$t('flow.var_name')"
          append-outer-icon="mdi-equal"
          solo
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
          class="ml-2"
          :label="$t('flow.var_value')"
          solo
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ParameterItem"
}
</script>

<style lang="scss">
.param-item {
  .v-input__control {
    min-height: 32px !important;
    max-height: 32px !important;
  }

  .v-input__slot {
    font-size: 10px !important;
  }

  .v-input__append-outer, {
    margin-top: 5px !important;
  }
}
</style>