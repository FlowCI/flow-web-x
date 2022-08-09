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

    <v-navigation-drawer v-if="canDisplay"
                         v-model="flowNavDrawer"
                         :clipped="$vuetify.breakpoint.lgAndUp"
                         width="20%"
                         app>
      <flow-menu></flow-menu>
    </v-navigation-drawer>

    <!-- global dialogs -->
    <create-flow-dialog></create-flow-dialog>

    <create-flow-group-dialog></create-flow-group-dialog>

    <!-- main app view -->
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
      <agent-menu v-if="canDisplay"></agent-menu>
      <profile-menu v-if="canDisplay"></profile-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-main>

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
  import actions from '@/store/actions'
  import { mapState } from 'vuex'
  import { connect, subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import CreateFlowDialog from "@/view/Flow/CreateDialog";
  import CreateFlowGroupDialog from "@/view/Flow/CreateGroupDialog";

  export default {
    name: 'App',
    components: {
      CreateFlowGroupDialog,
      CreateFlowDialog,
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
      connect(this.$store)
    },
    destroyed() {
      unsubscribeTopic.jobs()
      unsubscribeTopic.agents()
      unsubscribeTopic.hosts()
    },
    watch: {
      connection(isConnected) {
        if (isConnected) {
          console.log(this.$route.path)
          if (this.$route.path === '/loading') {
            this.$router.replace('/login')
            return
          }

          this.init()
          return
        }

        this.$router.replace('/loading')
      }
    },
    computed: {
      ...mapState({
        snackbar: state => state.g.snackbar,
        connection: state => state.g.connection
      }),

      canDisplay() {
        return !this.isLoginPage && this.connection
      }
    },
    methods: {
      refs(name) {
        return this.$refs[name]
      },

      init() {
        subscribeTopic.agents(this.$store)
        subscribeTopic.jobs(this.$store)
        subscribeTopic.hosts(this.$store)

        this.$store.dispatch(actions.settings.get).catch((e) => {
          console.log(e)
        })
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
