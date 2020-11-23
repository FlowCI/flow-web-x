<template>
  <div>
    <v-treeview hoverable open-on-click :open.sync="open" dense :items="items">
      <template v-slot:prepend="{ item }">
        <v-icon small :class="[item.color]">{{ item.icon }}</v-icon>
      </template>

      <template v-slot:label="{ item }">
        <v-row no-gutters>
          <v-col cols="2">
            <span>{{ item.name }}</span>
          </v-col>
          <v-col cols="2">
            <v-chip v-if="item.disabled"
                    x-small
                    label
                    class="mx-1"
                    color="error"
            >{{ $t('disabled').toLowerCase() }}
            </v-chip>
          </v-col>
          <v-col cols="8">
            <v-chip v-for="tag in item.tags"
                    :key="tag"
                    class="mx-1"
                    outlined
                    x-small
                    label
            >{{ tag }}
            </v-chip>
          </v-col>
        </v-row>
      </template>

      <template v-slot:append="{ item }">
        <div v-if="item.isAgent && !item.hostId">
          <v-btn icon class="ma-0" @click="onTokenCopyClick(item)">
            <v-icon small>flow-icon-file_copy</v-icon>
          </v-btn>
          <v-btn icon class="ma-0" @click="onAgentEditClick(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </div>

        <div v-if="item.isHost">
          <span class="overline font-weight-thin" v-if="item.isDefaultLocal">Default</span>
          <v-btn icon class="ma-0" @click="onHostEditClick(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </template>
    </v-treeview>

    <create-agent-dialog v-model="dialog"></create-agent-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { AgentWrapper } from '@/util/agents'
  import { HostWrapper } from '@/util/hosts'
  import actions from '@/store/actions'
  import CreateAgentDialog from "./CreateAgentDialog"

  export default {
    name: 'SettingsAgentHome',
    components: {
      CreateAgentDialog,
    },
    data() {
      return {
        dialog: false,
        hostMap: {},
        items: [
          {
            id: 1,
            name: `${this.$t('agent.agent')}:`,
            children: []
          },
          {
            id: 2,
            name: `${this.$t('agent.host')}:`,
            children: []
          },
        ],
        open: []
      }
    },
    mounted() {
      this.$emit('onConfigNav', {
        navs: [{text: this.$t('settings.li.agent')}],
        showAddBtn: true
      })

      this.$store.dispatch(actions.hosts.list).then(() => {
        this.buildHosts()

        this.$store.dispatch(actions.agents.list).then(() => {
          this.buildAgents()
        })
      })
    },
    computed: {
      ...mapState({
        hosts: state => state.hosts.items,
        agents: state => state.agents.items
      })
    },
    methods: {
      buildHosts() {
        let hosts = this.items[1]
        this.open.push(hosts.id)

        hosts.children = []
        this.hostMap = {}

        for (let host of this.hosts) {
          let wrapper = new HostWrapper(host)
          hosts.children.push(wrapper)
          this.hostMap[wrapper.id] = wrapper
        }
      },

      buildAgents() {
        let agents = this.items[0]
        agents.children = []

        Object.values(this.hostMap).forEach(value => {
          value.children = []
        })

        for (let agent of this.agents) {
          if (agent.hostId) {
            this.hostMap[agent.hostId].children.push(new AgentWrapper(agent))
            continue
          }

          agents.children.push(new AgentWrapper(agent))
        }

        this.open.push(agents.id)
      },

      onAddBtnClick() {
        this.dialog = true
      },

      onTokenCopyClick(wrapper) {
        this.$copyText(wrapper.token)
          .then((e) => {
            const text = 'Token ' + e.text + ' is copied'
            this.showSnackBar(text, 'info')
          })
          .catch((e) => {

          })
      },

      onAgentEditClick(wrapper) {
        this.$router.push({
          name: 'SettingsAgentEdit',
          params: {wrapper}
        })
      },

      onHostEditClick(wrapper) {
        this.$router.push({
          name: `SettingsHostEdit`,
          params: {wrapper}
        })
      }
    }
  }
</script>

<style scoped>
</style>
