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
        <td>{{ item.category }}</td>
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
        <span class="caption ml-1">Click '+' to create a config</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  import { mapState } from 'vuex'
  import { timeFormatInMins } from "@/util/time"
  import actions from '@/store/actions'

  export default {
    name: "SettingsConfigHome",
    data () {
      return {
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
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Configuration'
          }
        ],
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
      onAddBtnClick () {
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
