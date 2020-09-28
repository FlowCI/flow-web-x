<template>
  <div>
    system settings
  </div>
</template>

<script>
export default {
  name: "SystemSettingsHome",
  data() {
    return {

    }
  },
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.system')}],
      showAddBtn: false
    })
  }
}
</script>

<style scoped>

</style>
