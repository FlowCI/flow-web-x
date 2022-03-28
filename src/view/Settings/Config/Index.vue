<template>
  <v-data-table
      :headers="headers"
      :items="configs"
      :loading="loading"
      hide-default-footer
  >
    <template v-slot:item="{item}">
      <tr>
        <td>{{ item.name }}</td>
        <td>
          <v-icon small class="mr-2">{{ getCategoryData(item.category).icon }}</v-icon>
          <span class="caption">{{ getCategoryData(item.category).name }}</span>
        </td>
        <td>{{ timeFormatInMins(item.updatedAt) }}</td>
        <td>{{ item.updatedBy }}</td>
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
        <span class="caption ml-1">Click '+' to create a config</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  import { mapState } from 'vuex'
  import { timeFormatInMins } from "@/util/time"
  import { Categories } from '@/util/configs'
  import actions from '@/store/actions'

  export default {
    name: "SettingsConfigHome",
    data() {
      return {
        timeFormatInMins,
        Categories,
        loading: false,
        headers: [
          {text: 'Name', value: 'name', align: 'left'},
          {text: 'Category', value: 'category'},
          {text: 'Updated At', value: 'updatedAt'},
          {text: 'Updated By', value: 'updatedBy'},
          {text: '', align: 'right'}
        ]
      }
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: [{text: this.$t('settings.li.config')}],
        showAddBtn: true
      })

      this.loading = true
      this.$store.dispatch(actions.configs.list).then(() => {
        this.loading = false
      })
    },
    computed: {
      ...mapState({
        configs: state => state.configs.items
      })
    },
    methods: {
      getCategoryData(category) {
        let data = Categories[category]
        return data || {name: '', icon: ''}
      },

      onAddBtnClick() {
        this.$router.push({
          name: 'SettingsConfigNew'
        })
      },

      onEditClick(config) {
        this.$router.push({
          name: 'SettingsConfigEdit',
          params: {
            configObj: config
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
