<template>
  <v-row>
    <!-- finish button -->
    <v-col cols="1">
      <v-btn small
             color="primary"
             @click="handleFinishClick"
      >{{ $t('flow.create_btn_finish') }}</v-btn>
    </v-col>

    <!-- back button -->
    <v-col cols="1">
      <v-btn small
             outlined
             color="warning"
             @click="onBackClick"
      >{{ $t('back') }}</v-btn>
    </v-col>

    <!-- test button -->
    <v-col cols="1">
      <git-test-btn :wrapper="flow"></git-test-btn>
    </v-col>
  </v-row>
</template>

<script>
  import GitTestBtn from '@/components/Flow/GitTestBtn'

  export default {
    name: 'CreateTestGit',
    props: {
      flow: {
        required: true,
        type: Object
      },
      onBackClick: {
        required: true,
        type: Function
      },
      onNextClick: {
        required: true,
        type: Function
      }
    },
    components: {
      GitTestBtn
    },
    data () {
      return {
        start: false
      }
    },
    methods: {
      handleFinishClick () {
        this.onNextClick()
      }
    }
  }
</script>

<style scoped>

</style>
