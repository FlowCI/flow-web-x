<template>
  <v-tabs left class="flow-settings">
    <v-tab href="#tab-options">
      Options
    </v-tab>
    <v-tab href="#tab-env">
      Environment
    </v-tab>
    <v-tab href="#tab-config">
      Configuration
    </v-tab>
    <v-tab href="#tab-users">
      Members
    </v-tab>
    <v-tab-item value="tab-options">
      <settings-option-tab :flow="flow"></settings-option-tab>
    </v-tab-item>
    <v-tab-item value="tab-env">
      <settings-env-tab :flow="flow"></settings-env-tab>
    </v-tab-item>
    <v-tab-item value="tab-config">
      <settings-config-tab :flow="flow" :steps="steps"></settings-config-tab>
    </v-tab-item>
    <v-tab-item value="tab-users">
      <settings-member-tab :flow="flow"></settings-member-tab>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'
  import Nav from '@/components/Common/Nav'
  import SettingsOptionTab from '@/view/Flow/SettingsOptionTab'
  import SettingsEnvTab from '@/view/Flow/SettingsEnvTab'
  import SettingsConfigTab from '@/view/Flow/SettingsConfigTab'
  import SettingsMemberTab from '@/view/Flow/SettingsMemberTab'

  export default {
    name: 'FlowSettings',
    components: {
      SettingsConfigTab,
      SettingsEnvTab,
      SettingsOptionTab,
      SettingsMemberTab
    },
    computed: {
      ...mapState({
        steps: state => state.flows.steps,
        flow: state => state.flows.selected.obj
      }),
      name () {
        return this.$route.params.id
      }
    },
    watch: {
      name (after) {
        if (after !== this.flow.name) {
          this.$store.dispatch(actions.flows.select, after).then()
        }
      }
    },
    methods: {
      onBackClick () {
        this.$router.push({path: `/flows/${this.name}/jobs`})
      }
    }
  }
</script>

<style lang="scss">
.flow-settings {
  height: 100%;
  position: relative;
  overflow-y: auto;
}
</style>
