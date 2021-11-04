<template>
  <v-data-table
      :headers="headers"
      :items="notifications"
      :loading="loading"
      hide-default-footer
  >
    <template slot="no-data">
      <v-alert :value="true">
        <v-icon small>mdi-alert-outline</v-icon>
        <span class="caption ml-1">Click '+' to create a notification</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SettingsNotificationHome",
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.notify')}],
      showAddBtn: true
    })
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: 'Name', value: 'name', align: 'left'},
        {text: 'Category', value: 'category'},
        {text: 'Trigger', value: 'trigger'},
        {text: 'Created At', value: 'createdAt'},
        {text: 'Created By', value: 'createdBy'},
        {text: '', align: 'right'}
      ],
      notifications: []
    }
  },
  methods: {
    onAddBtnClick() {
      this.$router.push({
        name: 'SettingsNotificationNew'
      })
    },
  }
}
</script>

<style scoped>

</style>