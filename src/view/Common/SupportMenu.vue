<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" small class="mx-0 px-0">
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-subheader>{{ $t('menu.help') }}</v-subheader>

      <v-list-item href="https://github.com/FlowCI/docs" link target="_blank">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-file-document</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.doc') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://github.com/FlowCI/flow-platform-x/issues" link target="_blank">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-bug</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.issue') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'SupportMenu'
  }
</script>

<style scoped>

</style>