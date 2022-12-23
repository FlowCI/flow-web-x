<template>
  <edit-yaml :flow="flow" class="editor"></edit-yaml>
</template>

<script>
  import EditYaml from '@/components/Flow/EditYaml'

  export default {
    name: 'SettingsConfigTab',
    props: {
      // wrapper
      flow: {
        required: true,
        type: Object
      },
      steps: {
        required: true,
        type: Array
      }
    },
    components: {
      EditYaml,
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss">
  .flow-yml-settings {
    .tab-text {
      min-width: 65px;
      text-align: left;
      font-size: small;
      font-weight: bold;
    }

    .tab-active {
      color: #757575 !important;
    }

  }
</style>
