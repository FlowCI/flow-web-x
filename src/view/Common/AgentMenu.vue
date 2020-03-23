<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" small class="mx-0 px-0">
        <v-icon>mdi-view-grid</v-icon>
      </v-btn>
    </template>
    <v-list class="pa-0 agent-list">
      <v-list-item class="pl-0 item"
                    v-for="agent in items"
                   :key="agent.id"
                   @click="onAgentItemClick"
      >
        <div :class="[agent.color, 'state']"></div>

        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title>{{ agent.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ agent.freeMemory }} free (mb)</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>{{ agent.icon }}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import actions from '@/store/actions'
  import {subscribeTopic} from '@/store/subscribe'
  import {AgentWrapper, util} from '@/util/agents'
  import {mapState} from 'vuex'

  export default {
    name: 'AgentMenu',
    data() {
      return {
        items: []
      }
    },
    mounted() {
      this.$store.dispatch(actions.agents.list).then()
      subscribeTopic.agents(this.$store)
    },
    computed: {
      ...mapState({
        agents: state => state.agents.items,
        updated: state => state.agents.updated
      })
    },
    watch: {
      agents(after) {
        this.items = util.convert(after)
      },

      updated(after) {
        let wrapper = new AgentWrapper(after)
        let info = `Agent '${wrapper.name}' ${this.$t(wrapper.text)}`
        this.showSnackBar(info, 'info')
      }
    },
    methods: {
      onAgentItemClick() {
        // do nothing
      }
    }
  }
</script>

<style lang="scss">
  .agent-list {
    min-width: 260px;

    .item {
      height: 58px;
    }

    .state {
      height: 100%;
      width: 5%;
      margin-right: 10px;
    }

    .agent-name {
      min-width: 100px !important;
    }
  }
</style>
