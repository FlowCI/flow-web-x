<template>
  <div class="ma-3">
    <!-- Settings -->
    <v-row no-gutters>
      <v-col cols="12" class="mb-4">
        <span class="font-weight-black title">Settings</span>
        <v-divider></v-divider>
      </v-col>

      <v-col cols="7">
        <option-flow-settings :flow="flow"></option-flow-settings>
      </v-col>
    </v-row>

    <!-- Git Access Option -->
    <v-row no-gutters>
      <v-col cols="12" class="mt-4 mb-4">
        <span class="font-weight-black title">
          Git Access
          <v-btn icon link href="https://github.com/FlowCI/docs/blob/master/en/git/index.md" target="_blank">
            <v-icon small>mdi-help-circle-outline</v-icon>
          </v-btn>
        </span>
        <v-divider></v-divider>
      </v-col>

      <v-col cols="7">
        <option-git-access :flow="flow"></option-git-access>
      </v-col>
    </v-row>

    <!-- Danger Zone -->
    <v-row no-gutters v-if="hasPermission('Admin')">
      <v-col cols="12" class="mt-4 mb-1">
        <span class="font-weight-black title">Danger Zone</span>
      </v-col>

      <v-col cols="7" class="danger-zone px-2">
        <option-delete-flow :flow="flow"></option-delete-flow>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import OptionFlowSettings from '@/components/Flow/OptionFlowSettings'
  import OptionGitAccess from '@/components/Flow/OptionGitAccess'
  import OptionDeleteFlow from '@/components/Flow/OptionDeleteFlow'

  export default {
    name: 'SettingsOptionTab',
    props: {
      // wrapper
      flow: {
        required: true,
        type: Object
      }
    },
    components: {
      OptionFlowSettings,
      OptionGitAccess,
      OptionDeleteFlow
    },
    data() {
      return {}
    },
    methods: {
      onHelpClick(item) {
        console.log(item)
      }
    }
  }
</script>

<style scoped>
  .danger-zone {
    border-style: solid;
    border-width: 2px;
    border-color: red;
  }
</style>
