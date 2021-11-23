<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col cols="9">
        <v-subheader class="v-subheader-thin">{{ $t('settings.trigger.webhook_settings') }}</v-subheader>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <text-box label="URL"
                  v-model="value.url"
                  :rules="rules.required('URL is required')"
        ></text-box>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="9">
        <TextSelect label="HTTP Method"
                    v-model="value.httpMethod"
                    :items="['GET', 'POST', 'PUT', 'DELETE']"
        ></TextSelect>
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
            <key-value-table :items="value.paramItems"></key-value-table>
          </v-tab-item>

          <!-- headers tab-->
          <v-tab-item>
            <key-value-table :items="value.headerItems"></key-value-table>
          </v-tab-item>

          <!-- body tab-->
          <v-tab-item>
            <data-editor mode="json" v-model="value.body"></data-editor>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'
import KeyValueTable from "@/view/Settings/Trigger/KeyValueTable";
import DataEditor from "@/components/Settings/DataEditor";
import {required} from '@/util/rules'

export default {
  name: "WebhookSettings",
  components: {
    TextBox,
    TextSelect,
    DataEditor,
    KeyValueTable
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: null,
      rules: {
        required
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tab-active {
  background-color: #EEEEEE;
}
</style>