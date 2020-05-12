<template>
  <v-col cols="10">
    <v-card flat>
      <v-card-title>
        <v-autocomplete
            v-model="model"
            :items="searchResult"
            :search-input.sync="searchText"
            hide-no-data
            item-text="email"
            label="Search email to add member to flow"
            prepend-inner-icon="mdi-magnify-outline"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.email"></v-list-item-title>
              <v-list-item-subtitle v-text="item.role"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="onAddClick(item)">
                <v-icon small>mdi-plus-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </v-card-title>

      <v-card-text>
        <v-divider></v-divider>
        <v-data-table
            hide-default-header
            hide-default-footer
            :items="flowUsers"
            class="user-table"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>avatar</td>
              <td class="text-xs-left">{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td class="text-xs-right">
                <v-btn text icon class="ma-0" @click="onRemoveClick(item)">
                  <v-icon small>mdi-trash-can-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-slot:no-results>
            <v-alert :value="true">
              <v-icon small>mdi-alert-outline</v-icon>
              <span class="caption ml-1"> Your search for "{{ searchText }}" found no results.</span>
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
  import { mapState } from 'vuex'
  import actions from '@/store/actions'

  export default {
    name: 'SettingsUserTab',
    props: {
      flow: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        model: null,
        searchText: '',
        searchResult: []
      }
    },
    computed: {
      ...mapState({
        flowUsers: state => state.flows.users,
        allUsers: state => state.users.items
      }),

      notInFlowUsers() {
        if (this.flowUsers.length === 0 || this.allUsers.length === 0) {
          return []
        }

        return this.allUsers.filter(x => !this.flowUsers.some(y => x.id === y.id))
      }
    },
    mounted() {
      this.$store.dispatch(actions.flows.users.list, this.flow.name).catch(() => {
      })
      this.$store.dispatch(actions.users.listAll, {page: 1, size: 99999}).catch(() => {
      })
    },
    watch: {
      searchText(val) {
        this.searchResult = this.notInFlowUsers.filter(x => x.email.includes(val))
      }
    },
    methods: {
      onAddClick(user) {
        let payload = {name: this.flow.name, userEmail: user.email}
        this.$store.dispatch(actions.flows.users.add, payload)
            .then(() => {
              this.searchText = ''
            })
            .catch((err) => {
              console.log(err)
              this.searchText = ''
            })
      },

      onRemoveClick(user) {
        let payload = {name: this.flow.name, userEmail: user.email}
        this.$store.dispatch(actions.flows.users.remove, payload).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-table {
    td:first-child {
      width: 10%;
    }
  }
</style>
