<template>
<div>
  <step-graphic></step-graphic>
  <step-logging :on-debug-click="onDebugClick"></step-logging>
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
    props: {
      onDebugClick: {
        type: Function,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
