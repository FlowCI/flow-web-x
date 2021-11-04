<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="9">
        <v-subheader class="v-subheader-thin">{{ $t('settings.notification.email_settings') }}</v-subheader>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <text-select :items="smtpList"
                     label="SMTP Config"
                     v-model="value.smtp"
                     :rules="rules.required('SMTP config is required')"
        ></text-select>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <text-box label="Subject"
                  v-model="value.subject"
                  :rules="rules.required('Email subject is required')"
        ></text-box>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <text-box label="From" v-model="value.from"></text-box>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="9">
        <text-box label="To"
                  v-model="value.to"
                  :disable="toAllFlowUser"
                  :rules="rules.required('Email to is required')"
        ></text-box>
      </v-col>
      <v-col cols="3" class="align-center">
        <v-checkbox class="ml-1 mt-8"
                    label="To all flow users"
                    v-model="toAllFlowUser"
                    @change="onToAllFlowUserChange"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'
import {TO_ALL_FLOW_USERS} from '@/util/notifications'
import {required} from '@/util/rules'

export default {
  name: "EmailSettings",
  components: {
    TextBox,
    TextSelect
  },
  props: {
    value: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      TO_ALL_FLOW_USERS,
      toAllFlowUser: false,
      smtpList: [],
      rules: {
        required
      }
    }
  },
  methods: {
    onToAllFlowUserChange(val) {
      if (val) {
        this.value.to = this.TO_ALL_FLOW_USERS
        return
      }
      this.value.to = ''
    }
  }
}
</script>

<style scoped>

</style>