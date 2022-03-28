<template>
  <v-tabs fixed-tabs height="40" class="flow-settings" active-class="tab-active">
    <v-tabs-slider color="#757575"></v-tabs-slider>

    <v-tab href="#tab-options">
      <v-icon small class="mr-1">mdi-tune-variant</v-icon>
      {{ $t('flow.tab.options') }}
    </v-tab>
    <v-tab href="#tab-env">
      <v-icon small class="mr-1">mdi-variable</v-icon>
      {{ $t('flow.tab.variables') }}
    </v-tab>
    <v-tab href="#tab-config">
      <v-icon small class="mr-1">mdi-code-tags</v-icon>
      {{ $t('flow.tab.yaml') }}
    </v-tab>
    <v-tab href="#tab-users">
      <v-icon small class="mr-1">mdi-account-multiple-plus-outline</v-icon>
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

    .v-tab {
      margin-left: 0 !important;
      max-width: 200px !important;
      font-weight: bold;
    }

    .tab-active {
      color: #757575 !important;
    }
  }
</style>
