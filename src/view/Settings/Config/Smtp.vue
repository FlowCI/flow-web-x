<template>
  <v-row>
    <v-col cols="12">
      <text-box label="SMTP Server"
                :rules="rules.required"
                v-model="smtpOption.server"
      ></text-box>

      <text-box label="SMTP Port"
                :rules="rules.required"
                v-model="smtpOption.port"
      ></text-box>

      <text-box label="SMTP Username"
                v-model="smtpOption.auth.username"
      ></text-box>

      <text-box label="SMTP password"
                v-model="smtpOption.auth.password"
      ></text-box>

      <div>
        <v-radio-group v-model="smtpOption.isSecure"
                       row
                       dense
                       :rules="rules.required"
        >
          <v-radio label="None" :value=false></v-radio>
          <v-radio label="TLS/SSL" :value=true></v-radio>
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
      smtpOption: {
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
