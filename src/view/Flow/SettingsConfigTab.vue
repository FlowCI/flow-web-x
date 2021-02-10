<template>
  <v-tabs vertical class="flow-yml-settings px-1" active-class="tab-active">
    <v-tabs-slider color="#757575"></v-tabs-slider>

    <v-tab href="#tab-yaml">
      <v-icon small left>mdi-code-braces</v-icon>
      <span class="tab-text">YAML</span>
    </v-tab>
    <v-tab href="#tab-plugins">
      <v-icon small left>mdi-view-grid-plus</v-icon>
      <span class="tab-text">Plugins</span>
    </v-tab>

    <v-tab-item value="tab-yaml">
      <edit-yaml :flow="flow" class="editor"></edit-yaml>
    </v-tab-item>
    <v-tab-item value="tab-plugins">
      <plugins :flow="flow" :steps="steps" :notifications="notifications"></plugins>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import EditYaml from '@/components/Flow/EditYaml'
  import Plugins from '@/components/Flow/Plugins'

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
      },
      notifications: {
        required: true,
        type: Array
      }
    },
    components: {
      EditYaml,
      Plugins
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
