<template>
  <v-row>
    <v-col cols="12">
      <text-box label="SMTP Server"
                :rules="rules.required"
                v-model="config.server"
      ></text-box>

      <text-box label="SMTP Port"
                :rules="rules.required"
                v-model="config.port"
      ></text-box>

      <text-box label="SMTP Username"
                v-model="config.auth.username"
      ></text-box>

      <text-box label="SMTP password"
                type="password"
                v-model="config.auth.password"
      ></text-box>

      <div>
        <v-radio-group v-model="config.secure"
                       row
                       dense
                       :rules="rules.required"
        >
          <v-radio label="None" :value="SECURE_NONE"></v-radio>
          <v-radio label="SSL" :value="SECURE_SSL"></v-radio>
          <v-radio label="TLS" :value="SECURE_TLS"></v-radio>
        </v-radio-group>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import TextBox from '@/components/Common/TextBox'
  import { required } from '@/util/rules'
  import { SECURE_NONE, SECURE_SSL, SECURE_TLS } from '@/util/configs'

  export default {
    name: "SettingsConfigSmtp",
    props: {
      config: {
        required: true,
        type: Object
      }
    },
    components: {
      TextBox
    },
    data () {
      return {
        SECURE_NONE,
        SECURE_SSL,
        SECURE_TLS,
        rules: {
          required: required('SMTP property is required')
        }
      }
    }
  }
</script>

<style scoped>

</style>
