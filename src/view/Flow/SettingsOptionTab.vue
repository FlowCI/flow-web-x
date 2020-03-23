<template>
  <v-col cols="10">
    <v-row d-block class="flow-settings-option">
      <!-- Settings -->
      <v-col cols="12" class="mb-4">
        <span class="font-weight-black title">Settings</span>
        <v-divider></v-divider>
      </v-col>

      <v-col cols="7">
        <option-flow-name :flow="flow"></option-flow-name>
      </v-col>

      <!-- Git Access Option -->
      <v-col cols="12" class="mt-4 mb-4">
        <span class="font-weight-black title">Git Access</span>
        <v-divider></v-divider>
      </v-col>

      <v-col cols="7">
        <option-git-access :flow="flow"></option-git-access>
      </v-col>

      <!-- Danger Zone -->
      <v-col cols="12" class="mt-4 mb-1">
        <span class="font-weight-black title">Danger Zone</span>
      </v-col>

      <v-col cols="10" class="danger-zone pa-3">
        <option-delete-flow :flow="flow"></option-delete-flow>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
  import OptionFlowName from '@/components/Flow/OptionFlowName'
  import OptionGitAccess from '@/components/Flow/OptionGitAccess'
  import OptionDeleteFlow from '@/components/Flow/OptionDeleteFlow'

  export default {
    name: 'SettingsOptionTab',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    components: {
      OptionFlowName,
      OptionGitAccess,
      OptionDeleteFlow
    },
    data () {
      return {}
    },
    methods: {
      onHelpClick (item) {
        console.log(item)
      }
    }
  }
</script>

<style>
  .flow-settings-option .danger-zone {
    border-style: solid;
    border-width: 1px;
    border-color: red;
  }
</style>
