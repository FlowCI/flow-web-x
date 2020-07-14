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
        hide-default-footer
        hide-default-header>

      <template v-slot:header="{}">
        <div class="header">Agent Status</div>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-row no-gutters dense align="center">
              <v-col cols="2">
                <v-icon :class="[item.color]">{{ item.icon }}</v-icon>
              </v-col>

              <v-col cols="6">
                <div class="font-weight-bold">{{ item.name }}</div>
                <div class="caption">{{ item.freeMemory }} free (mb)</div>
              </v-col>

              <v-col cols="4">
                <span>{{ item.isBusy ? item.desc || '-' : '-' }}</span>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-menu>
</template>

<script>
  import actions from '@/store/actions'
  import { AgentWrapper, util } from '@/util/agents'
  import { mapState } from 'vuex'

  export default {
    name: 'AgentMenu',
    data() {
      return {
        items: [],
      }
    },
    mounted() {
      this.$store.dispatch(actions.agents.list).then()
    },
    computed: {
      ...mapState({
        agents: state => state.agents.items,
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
      loadFlowNameAndBuildNumber(wrapper) {
        const callback = (obj) => {
          let desc = '-'

          // find flow name since name could be change..
          for (let flow of this.flows) {
            if (flow.id === obj.flowId) {
              desc = `${flow.name}/#${obj.buildNumber}`
              break
            }
          }

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

    .header {
      padding: 1px 10px 1px 10px;
      font-weight: bold;
      font-size: small;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
    }
  }
</style>
