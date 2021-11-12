<template>
  <v-data-table
      :headers="headers"
      :items="triggers"
      :loading="loading"
      hide-default-footer
  >
    <template v-slot:item="{item}">
      <tr>
        <td>{{ item.name }}</td>
        <td>
          <v-icon small class="mr-2">{{ getCategory(item).icon }}</v-icon>
          <span class="caption">{{ getCategory(item).name }}</span>
        </td>
        <td>
          {{ item.action }}
        </td>
        <td>{{ timeFormatInMins(item.createdAt) }}</td>
        <td>{{ item.createdBy }}</td>
        <td>
          <v-btn icon class="ma-0" @click="onEditClick(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>


    <template slot="no-data">
      <v-alert :value="true">
        <v-icon small>mdi-alert-outline</v-icon>
        <span class="caption ml-1">Click '+' to create a notification</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
import actions from '@/store/actions'
import {mapState} from "vuex"
import {Categories} from "@/util/triggers"
import { timeFormatInMins } from "@/util/time"

export default {
  name: "SettingsTriggerHome",
  mounted() {
    this.$emit('onConfigNav', {
      navs: [{text: this.$t('settings.li.trigger')}],
      showAddBtn: true
    })

    this.$store.dispatch(actions.triggers.list).then();
  },
  data() {
    return {
      Categories,
      loading: false,
      timeFormatInMins,
      headers: [
        {text: 'Name', value: 'name', align: 'left'},
        {text: 'Category', value: 'category'},
        {text: 'Action', value: 'action'},
        {text: 'Created At', value: 'createdAt'},
        {text: 'Created By', value: 'createdBy'},
        {text: '', align: 'right'}
      ],
    }
  },
  computed: {
    ...mapState({
      triggers: state => state.triggers.items
    })
  },
  methods: {
    getCategory(item) {
      return Categories[item.category] || {name: '', icon: ''}
    },

    onAddBtnClick() {
      this.$router.push({
        name: 'SettingsTriggerNew'
      })
    },

    onEditClick(item) {
      this.$router.push({
        name: 'SettingsTriggerEdit',
        params: {
          name: item.name
        }
      })
    }
  }
}
</script>

<style scoped>

</style>