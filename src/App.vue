<template>
  <v-app id="inspire">
    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="5000"
        :top="true"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <v-navigation-drawer v-if="!isLoginPage"
                         v-model="flowNavDrawer"
                         :clipped="$vuetify.breakpoint.lgAndUp"
                         app>
      <flow-menu></flow-menu>
    </v-navigation-drawer>

    <v-app-bar app
               :clipped-left="$vuetify.breakpoint.lgAndUp"
               color="grey lighten-4">
      <v-toolbar-title>
        <v-app-bar-nav-icon @click.stop="flowNavDrawer = !flowNavDrawer"></v-app-bar-nav-icon>
        <v-icon class="black--text">flow-icon-logo</v-icon>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <lang-menu></lang-menu>
      <support-menu></support-menu>
      <agent-menu v-if="!isLoginPage"></agent-menu>
      <profile-menu v-if="!isLoginPage"></profile-menu>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

    <!--footer-->
    <v-footer class="caption" app>
      <v-spacer/>
      <div class="ml-4">
        flow.ci v{{ appVersion }}
      </div>
    </v-footer>
  </v-app>
</template>

<script>
  import FlowMenu from '@/view/Flow/Menu'
  import AgentMenu from '@/view/Common/AgentMenu'
  import ProfileMenu from '@/view/Common/ProfileMenu'
  import SupportMenu from '@/view/Common/SupportMenu'
  import LangMenu from '@/view/Common/LangMenu'
  import { mapState } from 'vuex'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'

  export default {
    name: 'App',
    components: {
      FlowMenu,
      AgentMenu,
      ProfileMenu,
      SupportMenu,
      LangMenu
    },
    data() {
      return {
        flowNavDrawer: true
      }
    },
    mounted() {
      subscribeTopic.agents(this.$store)
      subscribeTopic.jobs(this.$store)
      subscribeTopic.hosts(this.$store)
    },
    destroyed() {
      unsubscribeTopic.jobs()
      unsubscribeTopic.agents()
      unsubscribeTopic.hosts()
    },
    computed: {
      ...mapState({
        snackbar: state => state.g.snackbar
      })
    },
    methods: {
      refs(name) {
        return this.$refs[name]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn--floating .icon {
    height: unset !important;
    width: unset !important;
  }
</style>
