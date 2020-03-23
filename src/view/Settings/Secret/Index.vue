<template>
  <v-data-table
      :items="secrets"
      :loading="loading"
      hide-default-footer
      hide-default-headers>
    <template v-slot:item="{item}">
      <tr>
        <td>
          <v-row align="center" no-gutters>
            <v-col cols="3">
              {{ item.name }}
            </v-col>
            <v-col cols="3">
              {{ item.category }}
            </v-col>
            <v-col cols="4">
            </v-col>
            <v-col cols="1">
              <v-btn icon class="ma-0" @click="onEditClick(item)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </tr>
    </template>

    <template slot="no-data">
      <v-alert :value="true">
        <v-icon small>mdi-alert-outline</v-icon>
        <span class="caption ml-1">Click '+' to create a credential</span>
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'SettingsSecretHome',
    data () {
      return {
        loading: false
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Secrets'
          }
        ],
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
      onAddBtnClick () {
        this.$router.push({
          name: 'SettingsSecretNew'
        })
      },

      onEditClick (secret) {
        this.$router.push({
          name: 'SettingsSecretEdit',
          params: {
            credentialObj: secret
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
