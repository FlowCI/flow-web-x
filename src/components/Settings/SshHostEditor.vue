<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div>SSH Host Settings</div>
      </v-col>
      <v-col cols="12">
        <v-select dense
                  v-model="wrapper.secret"
                  :items="secrets"
                  :rules="rules.required"
                  label="Secret"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field dense
                      v-model="wrapper.user"
                      :rules="rules.required"
                      label="Host User"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field dense
                      v-model="wrapper.ip"
                      :rules="rules.required"
                      label="Host IP"
        ></v-text-field>
      </v-col>
    </v-row>
    <pool-size-editor :wrapper="wrapper"></pool-size-editor>
  </div>
</template>

<script>
  import { required } from '@/util/rules'
  import PoolSizeEditor from './PoolSizeEditor'

  export default {
    name: 'SshHostEditor',
    components: {
      PoolSizeEditor
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
    data () {
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
