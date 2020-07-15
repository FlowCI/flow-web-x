<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu offset-y nudge-bottom="15" nudge-left="50">
    <template v-slot:activator="{ on }">
        <v-btn text v-on="on" small class="mx-0 px-0">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
    </template>

    <v-list nav dense>
      <v-subheader>
        {{ user.email }}
      </v-subheader>

      <v-divider/>

      <v-list-item @click="onSettingsClick">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="onLogoutClick">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-menu>
</template>

<script>
  import actions from '@/store/actions'

  export default {
    name: 'AdminMenu',
    data () {
      return {

      }
    },

    methods: {
      onSettingsClick () {
        this.$router.push('/settings/profile')
      },

      onLogoutClick () {
        this.$store.dispatch(actions.auth.logout).then(() => {
          this.$router.replace('/login')
        })
      }
    }
  }
</script>

<style scoped>

</style>
