<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-menu offset-y nudge-bottom="15" nudge-left="50">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" small class="mx-0 px-0">
        <v-icon>mdi-view-grid</v-icon>
      </v-btn>
    </template>

    <v-data-table
        class="agent-list"
        :items="items"
        :headers="headers"
        hide-default-footer>

      <template v-slot:header.cpu="{ header }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{ header.icon }}</v-icon>
          </template>
          <span>{{ header.text }}</span>
        </v-tooltip>
      </template>

      <template v-slot:header.memory="{ header }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{ header.icon }}</v-icon>
          </template>
          <span>{{ header.text }}</span>
        </v-tooltip>
      </template>

      <template v-slot:header.disk="{ header }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{ header.icon }}</v-icon>
          </template>
          <span>{{ header.text }}</span>
        </v-tooltip>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td class="text-center">
            <span class="font-weight-bold">{{ item.name }}</span>
          </td>
          <td class="text-center">
            <v-icon small :class="[item.color]">{{ item.icon }}</v-icon>
          </td>
          <td class="text-center">
            <span v-if="!item.isOffline">{{ item.upAt }}</span>
            <span v-if="item.isOffline">-</span>
          </td>
          <td class="text-center">
            <span v-if="item.isBusy">{{ item.desc }}</span>
            <span v-if="item.isOffline || item.isIdle">-</span>
            <span v-if="item.isStarting">
              <v-icon small light class="loading-anim">flow-icon-loading1</v-icon>
            </span>
          </td>
          <td class="text-center">
            <v-progress-linear :value="fetchProfile(item.token, 'cpuUsage')"
                               height="25"
                               rounded>
              <template v-slot:default="{ value }">
                <strong v-if="item.isOffline">-</strong>
                <strong v-if="!item.isOffline">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </td>
          <td class="text-center">
            <v-progress-linear :value="memory(item.token)" height="25" rounded>
              <template v-slot:default="{ value }">
                <strong v-if="item.isOffline">-</strong>
                <strong v-if="!item.isOffline">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </td>
          <td class="text-center">
            <v-progress-linear :value="disk(item.token)" height="25" rounded>
              <template v-slot:default="{ value }">
                <strong v-if="item.isOffline">-</strong>
                <strong v-if="!item.isOffline">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </td>
        </tr>
      </template>

      <template slot="no-data">
        <span class="caption">{{ $t('agent.list_no_data') }}</span>
      </template>
    </v-data-table>
  </v-menu>
</template>

<script>
import actions from '@/store/actions'
import {AgentWrapper, util} from '@/util/agents'
import {mapState} from 'vuex'

export default {
  name: 'AgentMenu',
  data() {
    return {
      items: [],
      headers: [
        {text: 'NAME', value: 'name', align: 'center', sortable: false},
        {text: 'OS', value: 'os', align: 'center', sortable: false},
        {text: 'UPTIME', value: 'uptime', align: 'center', sortable: false},
        {text: 'JOB', value: 'job', align: 'center', sortable: false, width: "120px"},
        {text: 'CPU', value: 'cpu', align: 'center', sortable: false, width: "80px", icon: "mdi-cpu-64-bit"},
        {text: 'MEMORY', value: 'memory', align: 'center', sortable: false, width: "80px", icon: "mdi-memory"},
        {text: 'DISK', value: 'disk', align: 'center', sortable: false, width: "80px", icon: "mdi-harddisk"}
      ]
    }
  },
  mounted() {
    this.$store.dispatch(actions.agents.list).then()
  },
  computed: {
    ...mapState({
      agents: state => state.agents.items,
      profiles: state => state.agents.profiles,
      updated: state => state.agents.updated,
      flows: state => state.flows.items
    })
  },
  watch: {
    agents(after) {
      this.items = util.convert(after)
      for (let wrapper of this.items) {
        this.loadFlowNameAndBuildNumber(wrapper)
      }
    },

    updated(after) {
      let wrapper = new AgentWrapper(after)
      let info = `Agent '${wrapper.name}' ${this.$t(wrapper.text)}`
      this.showSnackBar(info, 'info')
      this.loadFlowNameAndBuildNumber(wrapper)
    }
  },
  methods: {
    memory(token) {
      let free = this.fetchProfile(token, 'freeMemory')
      let total = this.fetchProfile(token, 'totalMemory')
      return free / total * 100
    },

    disk(token) {
      let free = this.fetchProfile(token, 'freeDisk')
      let total = this.fetchProfile(token, 'totalDisk')
      return free / total * 100
    },

    fetchProfile(token, prop) {
      let p = this.profiles[token]
      if (p) {
        return p[prop]
      }
      return 0
    },

    loadFlowNameAndBuildNumber(wrapper) {
      const callback = (obj) => {
        let desc = `${obj.flowName}/#${obj.buildNumber}`

        // update item list
        for (let item of this.items) {
          if (item.id === wrapper.id) {
            item.desc = desc
            break
          }
        }
      }

      if (wrapper.isBusy && wrapper.jobId) {
        this.$store.dispatch(actions.jobs.getDesc, {
          jobId: wrapper.jobId,
          onCallback: callback
        })
      }
    }
  }
}
</script>

<style lang="scss">
.agent-list {
  min-width: 350px;

  .v-data-table-header th[role="columnheader"] {
    font-weight: bold;
    font-size: small;
    height: 35px;
  }
}
</style>
