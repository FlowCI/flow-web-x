<template>
  <div>
    <v-row>
      <v-col>
        <span class="font-weight-bold caption">SSH Host Settings</span>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <text-select
            v-model="wrapper.secret"
            :items="secrets"
            :rules="rules.required"
            label="Secret"
        ></text-select>

        <text-box
            v-model="wrapper.user"
            :rules="rules.required"
            label="Host User"
        ></text-box>

        <text-box
            v-model="wrapper.ip"
            :rules="rules.required"
            label="Host IP"
        ></text-box>
      </v-col>

      <v-col cols="4">
        <text-box
            type="number"
            label="Port"
            v-model="wrapper.port"
        ></text-box>
      </v-col>

      <v-col cols="1"></v-col>

      <v-col cols="4">
        <text-box
            max="50"
            min="1"
            step="1"
            type="number"
            label="Max Pool Size"
            v-model="wrapper.maxSize"
        ></text-box>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required } from '@/util/rules'
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'

export default {
  name: 'SshHostEditor',
  components: {
    TextBox,
    TextSelect
  },
  props: {
    wrapper: {
      type: Object,
      required: true
    },
    secrets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        required: required('Required')
      }
    }
  }
}
</script>

<style scoped>

</style>
