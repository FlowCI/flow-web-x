<template>
  <v-card class="full-size pt-0 flow-main">
    <v-card-title class="title pa-0 bottom-border">
      <v-toolbar flat bottom>
        <v-toolbar-title class="d-flex mx-1">
          <v-icon small class="mr-3">flow-icon-layergroup</v-icon>

          <v-breadcrumbs :items="navItems" class="pa-0">
            <template v-slot:divider>
              <v-icon>mdi-slash-forward</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="item.href">
                <span class="text-h6 font-weight-bold">{{ item.text }}</span>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items class="align-baseline" v-if="showFlowAction">
          <run-dialog></run-dialog>

          <v-btn
              text
              color="blue-grey"
              class="white--text"
              @click="onStatisticClick"
          >
            <v-icon class="mr-1">mdi-trending-up</v-icon>
            {{ $t('flow.statistic') }}
          </v-btn>

          <v-btn
              text
              color="blue-grey"
              class="white--text"
              @click="onSettingsClick"
          >
            <v-icon class="mr-1">mdi-cog</v-icon>
            {{ $t('flow.settings') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card-title>

    <v-card-text class="content pa-0">
      <router-view></router-view>
    </v-card-text>
  </v-card>
</template>

<script>
import actions from '@/store/actions'
import {mapState} from 'vuex'
import RunDialog from "@/components/Flow/RunDialog";

export default {
  name: 'FlowHome',
  components: {RunDialog},
  data() {
    return {
      baseItem: {text: 'flows', href: '#/flows'},
      selectedBranch: 'master',
      navItems: [],
    }
  },
  computed: {
    ...mapState({
      agents: state => state.agents.items,
      selected: state => state.flows.selected
    }),

    showFlowAction() {
      return this.$route.name === 'Jobs'
    },

    flowName() {
      return this.$route.params.id
    },

    buildNumber() {
      return this.$route.params.num
    }
  },
  mounted() {
    if (this.$route.name === 'Overview') {
      this.navItems = [this.baseItem]
      return
    }

    this.setCurrentFlow()
  },

  watch: {
    '$route' (route, from){
      if (route.name === 'Overview') {
        this.navItems = [this.baseItem]
        return
      }

      // will trigger 'selected' watcher
      this.setCurrentFlow()
    },

    selected: {
      handler: function(val) {
        const flowWrapper = val.obj
        let route = this.$route
        let href = '#' + route.path
        this.navItems = [this.baseItem]

        if (flowWrapper.parent) {
          const p = {text: flowWrapper.parent.name, href}
          this.navItems.push(p)
        }

        let flowItem = {text: flowWrapper.name, href}
        this.navItems.push(flowItem)

        if (route.name === 'Jobs') {
          this.loadBranches()
          return
        }

        flowItem.href = `#/flows/${flowWrapper.name}/jobs`

        if (route.name === 'Settings') {
          let settingsItem = {text: 'settings', href};
          this.navItems.push(settingsItem)
          return
        }

        if (route.name === 'Statistic') {
          let statItem = {text: 'statistic', href};
          this.navItems.push(statItem)
          return
        }

        if (route.name === 'JobDetail') {
          let detailItem = {text: '#' + this.buildNumber, href};
          this.navItems.push(detailItem)
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    onSettingsClick() {
      this.$router.push(`/flows/${this.flowName}/settings`)
    },

    onStatisticClick() {
      this.$router.push(`/flows/${this.flowName}/statistic`)
    },

    setCurrentFlow() {
      this.$store.dispatch(actions.flows.select, this.flowName).then()
    },

    loadBranches() {
      this.$store.dispatch(actions.flows.gitBranches, this.flowName)
          .catch((err) => {
            console.log(err)
          })
    }
  }
}
</script>

<style lang="scss">
.flow-main {
  .title {
    max-height: 75px;
    min-height: 75px;
  }

  .content {
    min-height: 90%;
  }

  .v-toolbar__content {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .v-breadcrumbs__divider {
    padding: 0 !important;
  }
}
</style>
