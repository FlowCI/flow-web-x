<template>
  <v-data-table
      :headers="headers"
      :items="secrets"
      :loading="loading"
      hide-default-footer
  >
    <template v-slot:item="{item}">
      <tr>
        <td>{{ item.name }}</td>
        <td>
          <v-icon small class="mr-2">{{ Categories[item.category].icon }}</v-icon>
          <span class="caption">{{ Categories[item.category].name }}</span>
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
        <span class="caption ml-1">Click '+' to create a secret</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  import { mapState } from 'vuex'
  import { timeFormatInMins } from "@/util/time"
  import { Categories } from '@/util/secrets'
  import actions from '@/store/actions'

  export default {
    name: 'SettingsSecretHome',
    data() {
      return {
        Categories,
        timeFormatInMins,
        loading: false,
        headers: [
          {text: 'Name', value: 'name', align: 'left'},
          {text: 'Category', value: 'category'},
          {text: 'Created At', value: 'createdAt'},
          {text: 'Created By', value: 'createdBy'},
          {text: '', align: 'right'}
        ]
      }
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: [{text: this.$t('settings.li.secret')}],
        showAddBtn: true
      })

      this.loading = true
      this.$store.dispatch(actions.secrets.list).then(() => {
        this.loading = false
      })
    },
    computed: {
      ...mapState({
        secrets: state => state.secrets.items
      })
    },
    methods: {
      onAddBtnClick() {
        this.$router.push({
          name: 'SettingsSecretNew'
        })
      },

      onEditClick(secret) {
        this.$router.push({
          name: 'SettingsSecretEdit',
          params: {
            secretObj: secret
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
