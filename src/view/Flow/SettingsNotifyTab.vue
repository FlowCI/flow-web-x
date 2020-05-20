<template>
  <div class="notify-tab">
    <v-row>
      <v-col cols="3" v-for="item in items" :key="item.name">
        <option-notify-item :wrapper="item"></option-notify-item>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import OptionNotifyItem from "@/components/Flow/OptionNotifyItem";
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { PluginWrapper } from '@/util/plugins'

  export default {
    name: "SettingsNotifyTab",
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    mounted() {
      this.$store.dispatch(actions.plugins.notifies).then()
    },
    components: {
      OptionNotifyItem
    },
    data() {
      return {
        items: []
      }
    },
    computed: {
      ...mapState({
        notifies: state => state.plugins.notifies,
        iconCache: state => state.plugins.icon
      })
    },
    watch: {
      notifies(val) {
        this.items = []
        for (let p of val) {
          this.items.push(new PluginWrapper(p))
        }
      }
    }
  }
</script>

<style scoped>

</style>
