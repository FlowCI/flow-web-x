<template>
  <v-tabs left class="flow-settings">
    <v-tab href="#tab-options">
      {{ $t('flow.tab.options') }}
    </v-tab>
    <v-tab href="#tab-env">
      {{ $t('flow.tab.variables') }}
    </v-tab>
    <v-tab href="#tab-config">
      {{ $t('flow.tab.yaml') }}
    </v-tab>
    <v-tab href="#tab-users">
      {{ $t('flow.tab.members') }}
    </v-tab>
    <v-tab-item value="tab-options">
      <settings-option-tab :flow="flow"></settings-option-tab>
    </v-tab-item>
    <v-tab-item value="tab-env">
      <settings-env-tab :flow="flow"></settings-env-tab>
    </v-tab-item>
    <v-tab-item value="tab-config">
      <settings-config-tab :flow="flow"
                           :steps="steps"
                           :notifications="notifications"
      ></settings-config-tab>
    </v-tab-item>
    <v-tab-item value="tab-users">
      <settings-member-tab :flow="flow"></settings-member-tab>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'
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
      SettingsMemberTab,
    },
    computed: {
      ...mapState({
        steps: state => state.flows.steps,
        notifications: state => state.flows.notifications,
        flow: state => state.flows.selected.obj
      }),
      name() {
        return this.$route.params.id
      }
    },
    watch: {
      name(after) {
        if (after !== this.flow.name) {
          this.$store.dispatch(actions.flows.select, after).then()
        }
      }
    },
    methods: {
      onBackClick() {
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

    .v-tabs-items {
      height: 93%;

      .v-window__container {
        height: 100%;

        .v-window-item {
          height: 100%;
        }
      }
    }
  }
</style>
