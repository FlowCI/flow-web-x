<template>
  <v-row>
    <v-col cols="12">
      <text-box title="SMTP Server"
                :rules="rules.required"
                v-model="configObj.server"
      ></text-box>

      <text-box title="SMTP Port"
                :rules="rules.required"
                v-model="configObj.port"
      ></text-box>

      <text-box title="SMTP Username"
                :rules="rules.required"
                v-model="configObj.username"
      ></text-box>

      <text-box title="SMTP password"
                v-model="configObj.password"
      ></text-box>

      <div>
        <v-radio-group v-model="configObj.isSSL"
                       row
                       dense
                       :rules="rules.required"
        >
          <v-radio label="None" value="false"></v-radio>
          <v-radio label="TLS/SSL" value="true"></v-radio>
        </v-radio-group>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import TextBox from '@/components/Common/TextBox'
  import { required } from '@/util/rules'

  export default {
    name: "SettingsConfigSmtp",
    props: {
      configObj: {
        required: true,
        type: Object
      }
    },
    components: {
      TextBox
    },
    data () {
      return {
        rules: {
          required: required('SMTP property is required')
        }
      }
    }
  }
</script>

<style scoped>

</style>
