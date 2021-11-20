<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="9">
        <v-subheader class="v-subheader-thin">{{ $t('settings.trigger.webhook_settings') }}</v-subheader>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="9">
        <v-tabs fixed-tabs
                v-model="tab"
                background-color="grey lighten-4"
                active-class="tab-active"
        >
          <v-tab>Params</v-tab>
          <v-tab>Headers</v-tab>
          <v-tab>Body</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">

          <!-- params tab-->
          <v-tab-item>
            <key-value-table :items="params"></key-value-table>
          </v-tab-item>

          <!-- headers tab-->
          <v-tab-item>2</v-tab-item>

          <!-- body tab-->
          <v-tab-item>3</v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import KeyValueTable from "@/view/Settings/Trigger/KeyValueTable";

export default {
  name: "WebhookSettings",
  components: {
    KeyValueTable
  },
  data() {
    return {
      tab: null,
      params: [{key: '', value: '', keyError: false, valueError: false, showAddBtn: true}]
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.tab-active {
  background-color: #EEEEEE;
}
</style>