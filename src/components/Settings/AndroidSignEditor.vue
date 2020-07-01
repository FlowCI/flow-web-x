<template>
  <v-row>
    <v-col cols="12">
      <div>
        <v-subheader class="no-padding">Key store file (jks)</v-subheader>
        <v-file-input dense
                      solo
                      prepend-icon=""
                      append-icon="mdi-paperclip"
                      label=""
                      show-size
                      :rules="rules.file"
                      v-model="model.keyStore"
        ></v-file-input>
      </div>

      <text-box label="Key store password"
                password
                :rules="rules.required"
                v-model="model.keyStorePassword.data"
      ></text-box>
      <text-box label="Key alias"
                :rules="rules.required"
                v-model="model.keyAlias"
      ></text-box>
      <text-box label="Key password"
                password
                :rules="rules.required"
                v-model="model.keyPassword.data"
      ></text-box>
    </v-col>
  </v-row>
</template>

<script>
  import TextBox from '@/components/Common/TextBox'
  import { required } from '@/util/rules'

  export default {
    name: "AndroidSignEditor",
    props: {
      model: {
        required: true,
        type: Object
      }
    },
    components: {
      TextBox
    },
    data() {
      return {
        rules: {
          required: required('Android sign property is required'),
          file: required('Android sign property is required').concat(
            [value => !value || value.size < 10000 || 'file size should be less than 10 KB!'])
        }
      }
    }
  }
</script>

<style scoped>

</style>
