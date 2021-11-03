<template>
  <div></div>
</template>

<script>
export default {
  name: "SettingsNotificationHome",
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.notify')}],
      showAddBtn: true
    })
  }
}
</script>

<style scoped>

</style>