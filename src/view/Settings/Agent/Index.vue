<template>
  <div>
    <v-treeview hoverable dense :items="items">
      <template v-slot:prepend="{ item }">
        <v-icon small>{{ item.icon }}</v-icon>
      </template>

      <template v-slot:label="{ item }">
        <span>{{ item.name }}</span>

        <v-icon x-small
                class="mx-2"
                :color="item.color"
                v-if="item.isAgent || item.isHost"
        >mdi-checkbox-blank-circle
        </v-icon>

        <v-chip v-for="tag in item.tags"
                :key="tag"
                class="mx-1"
                outlined
                x-small
                label
        >{{ tag }}
        </v-chip>
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-btn min-height="150"
                     block
                     color="primary"
                     @click="onNewAgentClick"
              >Manual agent
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn min-height="150"
                     block
                     color="primary"
                     @click="onNewHostClick"
              >Host with auto agent
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { AgentWrapper } from '@/util/agents'
  import { HostWrapper } from '@/util/hosts'
  import { subscribeTopic, unsubscribeTopic } from '@/store/subscribe'
  import actions from '@/store/actions'

  export default {
    name: 'SettingsAgentHome',
    data () {
      return {
        dialog: false,
        hostMap: {},
        items: [
          {
            id: 1,
            name: 'Agents:',
            children: []
          },
          {
            id: 2,
            name: 'Hosts:',
            children: []
          }
        ]
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: [
          {
            text: 'Agents'
          }
        ],
        showAddBtn: true
      })

      this.$store.dispatch(actions.hosts.list).then(() => {
        this.buildHosts()

        this.$store.dispatch(actions.agents.list).then(() => {
          this.buildAgents()
        })

        subscribeTopic.hosts(this.$store)
      })
    },
    beforeDestroy () {
      unsubscribeTopic.hosts()
    },
    computed: {
      ...mapState({
        hosts: state => state.hosts.items,
        agents: state => state.agents.items
      })
    },
    methods: {
      buildHosts () {
        let hosts = this.items[ 1 ]
        hosts.children = []
        this.hostMap = {}

        for (let host of this.hosts) {
          let wrapper = new HostWrapper(host)
          hosts.children.push(wrapper)
          this.hostMap[ wrapper.id ] = wrapper
        }
      },

      buildAgents () {
        let agents = this.items[ 0 ]
        agents.children = []

        Object.values(this.hostMap).forEach(value => {
          value.children = []
        })

        for (let agent of this.agents) {
          if (agent.hostId) {
            this.hostMap[ agent.hostId ].children.push(new AgentWrapper(agent))
            continue
          }

          agents.children.push(new AgentWrapper(agent))
        }
      },

      onAddBtnClick () {
        this.dialog = true
      },

      onNewAgentClick () {
        this.$router.push('/settings/agents/new')
      },

      onNewHostClick () {
        this.$router.push('/settings/agents/host/new')
      },

      onTokenCopyClick (wrapper) {
        this.$copyText(wrapper.token)
          .then((e) => {
            const text = 'Token ' + e.text + ' is copied'
            this.showSnackBar(text, 'info')
          })
          .catch((e) => {

          })
      },

      onAgentEditClick (wrapper) {
        this.$router.push('/settings/agents/edit/' + wrapper.name)
      },

      onHostEditClick (wrapper) {
        this.$router.push('/settings/agents/host/edit/' + wrapper.name)
      }
    }
  }
</script>

<style scoped>
</style>
