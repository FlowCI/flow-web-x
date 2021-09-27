<template>
  <v-data-table
      :headers="headers"
      :items="pluginList"
  >
    <template v-slot:item="{item}">
      <tr>
        <td><a :href="item.source" target="_blank">{{ item.name }}</a></td>
        <td>{{ item.version }}</td>
        <td>{{ item.desc }}</td>
        <td>
          <v-icon small color="green" v-if="item.synced">mdi-check-circle</v-icon>
          <v-icon small color="red" v-else>mdi-close-circle-outline</v-icon>
        </td>
        <td>{{ item.syncTime }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import actions from "@/store/actions";
import {mapState} from "vuex";
import { PluginWrapper } from '@/util/plugins'

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

  data() {
    return {
      loading: false,
      pluginList: [],
      headers: [
        {text: 'Name', sortable: true, value: 'name'},
        {text: 'Version', value: 'version'},
        {text: 'Description', value: 'description'},
        {text: 'Synced', value: 'synced'},
        {text: 'Last sync time', value: 'synced'},
      ]
    }
  },

  computed: {
    ...mapState({
      plugins: state => state.plugins.items,
    })
  },

  watch: {
    plugins(val) {
      this.pluginList = []
      for (let p of val) {
        this.pluginList.push(new PluginWrapper(p))
      }
    },
  }

}
</script>

<style scoped>

</style>