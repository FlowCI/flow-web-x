<template>
  <v-data-table
      :headers="headers"
      :items="items"
      hide-default-footer
  >
    <template v-slot:item="{item}">
      <tr>
        <td>
          <v-icon small class="mr-1">{{ sources[item.source].icon}}</v-icon>
          <span>{{ sources[item.source].name }}</span>
        </td>
        <td>{{ item.secret }}</td>
        <td>{{ timeFormatInMins(item.updatedAt) }}</td>
        <td>{{ item.updatedBy }}</td>
        <td>
          <v-btn icon class="ma-0" @click="onEditClick(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import {mapState} from "vuex";
import actions from "@/store/actions";
import {GitSources} from "@/util/git";
import { timeFormatInMins } from "@/util/time"

export default {
  name: "SettingsGitHome",
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.git')}],
      showAddBtn: true
    })

    this.loading = true
    this.$store.dispatch(actions.git.list).then(() => {
      this.loading = false
    })
  },
  data() {
    return {
      timeFormatInMins,
      sources: GitSources,
      loading: false,
      headers: [
        {text: 'Git Source', sortable: true, value: 'name'},
        {text: 'Secret', value: 'secret'},
        {text: 'Updated At', value: 'updatedAt'},
        {text: 'Updated By', value: 'updatedBy'},
        {text: '', align: 'right'}
      ],
    }
  },
  computed: {
    ...mapState({
      items: state => state.git.items
    }),
  },
  methods: {
    onAddBtnClick() {
      this.$router.push({
        name: 'SettingsGitNew'
      })
    },

    onEditClick(item) {
      this.$router.push({
        name: 'SettingsGitEdit',
        params: {
          gitObj: item
        }
      })
    }
  }
}
</script>

<style scoped>

</style>