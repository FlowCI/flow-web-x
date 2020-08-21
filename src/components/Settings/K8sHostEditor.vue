<template>
  <div>
    <v-row>
      <v-col>
        <span class="font-weight-bold caption">K8s Host Settings</span>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <text-box
            v-model="wrapper.namespace"
            :rules="rules.required"
            label="Namespace"
        ></text-box>

        <text-select
            v-model="wrapper.secret"
            :items="secrets"
            :rules="rules.required"
            label="Select a secret"
        ></text-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required } from '@/util/rules'
import TextBox from '@/components/Common/TextBox'
import TextSelect from '@/components/Common/TextSelect'

export default {
  name: "K8sHostEditor",
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
