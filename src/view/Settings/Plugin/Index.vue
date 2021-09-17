<template>
  <div></div>
</template>

<script>
import actions from "@/store/actions";
import {mapState} from "vuex";

export default {
  name: "PluginSettingsHome",

  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.plugin')}],
      showAddBtn: false
    })

    this.$store.dispatch(actions.plugins.list).then(() => {
    })
  },

  computed: {
    ...mapState({
      plugins: state => state.plugins.items,
    })
  }

}
</script>

<style scoped>

</style>