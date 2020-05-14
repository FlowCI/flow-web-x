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
      <edit-yaml :flow="flow" class="editor"></edit-yaml>
    </v-tab-item>
    <v-tab-item value="tab-plugins">
      <plugins :flow="flow" :steps="steps"></plugins>
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

<style lang="scss">
  .flow-yml-settings {
    width: 98% !important;
    height: 100%;

    .tab-text {
      min-width: 65px;
      text-align: left;
    }

    .v-tabs-items {
      margin-left: 5px;
      height: 100% !important;

      .v-window__container {
        height: 100%;

        .v-window-item {
          height: 100%;
        }
      }
    }
  }
</style>
