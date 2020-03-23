<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
<div>
  <step-graphic></step-graphic>
  <step-logging></step-logging>
</div>
</template>

<script>
  import StepGraphic from '@/components/Jobs/StepGraphic'
  import StepLogging from '@/components/Jobs/StepLogging'

  export default {
    name: 'DetailTabSummary',
    components: {
      StepGraphic,
      StepLogging
    },
    data() {
      return {
      
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
