<template>
  <v-row align="center">
    <v-col cols="12">
      <text-box
          label="Token"
          type="password"
          v-model="model.token.data"
      ></text-box>
    </v-col>
  </v-row>
</template>

<script>
  import TextBox from '@/components/Common/TextBox'

  export default {
    name: 'TokenEditor',
    props: {
      /**
       * Ex: {
       *   token: {
       *     data: 'xxx',
       *   }
       * }
       */
      model: {
        type: Object,
        required: true
      },
    },
    components: {
      TextBox
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped>

</style>
