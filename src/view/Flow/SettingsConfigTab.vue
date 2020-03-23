<template>
  <v-tabs vertical class="flow-yml-settings">
    <v-tabs-slider></v-tabs-slider>

    <v-tab href="#tab-yaml">
      <v-icon left>mdi-code-braces</v-icon>
      <span class="tab-text">YAML</span>
    </v-tab>
    <v-tab href="#tab-plugins">
      <v-icon left>mdi-view-grid-plus</v-icon>
      <span class="tab-text">Plugins</span>
    </v-tab>
    <v-tab-item value="tab-yaml">
      <edit-yaml :flow="flow" class="mt-2 editor"></edit-yaml>
    </v-tab-item>
    <v-tab-item value="tab-plugins">
      <plugins :flow="flow" :steps="steps" class="mt-2"></plugins>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import EditYaml from '@/components/Flow/EditYaml'
  import Plugins from '@/components/Flow/Plugins'

  export default {
    name: 'SettingsConfigTab',
    props: {
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
      Plugins
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  .flow-yml-settings {
    width: 98%
  }

  .tab-text {
    min-width: 65px;
    text-align: left;
  }

  .editor {
    height: 700px;
  }
</style>
