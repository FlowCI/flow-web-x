<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-data-table
        v-for="(value, key) in contextData"
        :key="key"
        :items="value.data"
        class="mb-2 bottom-border"
        v-show="value.show"
        disable-pagination
        hide-default-footer
        hide-default-header>

      <template v-slot:header="{}">
        <div class="header">{{ value.name }}</div>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-row no-gutters>
              <v-col cols="2" class="caption">
                <a v-if="item.key_link" :href="item.key_link" target="_blank">{{ item.key }}</a>
                <span v-else>{{ item.key }}</span>
              </v-col>

              <v-col class="caption d-flex">
                <div class="vertical-bar mr-4" v-if="value.showBar"></div>

                <div v-if="item.value instanceof Array">
                    <div v-for="(itemOfArray, index) of item.value" :key="index">
                      <span>-</span>
                      <a :href="itemOfArray.url" target="_blank" class="mx-2">{{ itemOfArray.id }}</a>
                      <span>{{ itemOfArray.message }}</span>
                    </div>
                </div>

                <div v-else>
                  <a v-if="item.value_link" :href="item.value_link" target="_blank">{{ item.value }}</a>
                  <span class="d-inline-block overflow-x-auto" style="width: 800px;" v-else>{{ item.value }}</span>
                </div>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>

</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'JobDetailInfo',
  data() {
    return {}
  },
  props: {
    wrapper: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapState({
      relatedJobs: state => state.jobs.relatedJobs,
    }),

    contextData() {
      return {
        agent: {
          name: 'Agent Detail',
          show: true,
          data: this.getAgentData()
        },

        push: {
          name: 'Git Push Info',
          show: this.wrapper.isPushTrigger || this.wrapper.hasGitCommitInfo,
          data: this.getPushData()
        },

        tag: {
          name: 'Git Tag Info',
          show: this.wrapper.isTagTrigger,
          data: this.getTagData()
        },

        pr: {
          name: 'Git Pull Request Info',
          show: this.wrapper.isPrOpenedTrigger || this.wrapper.isPrClosedTrigger,
          data: this.getPrData()
        },

        relatedJobs: {
          name: 'Related jobs for this git event',
          show: this.relatedJobs.length > 0,
          data: this.getRelatedJobsData()
        },

        variables: {
          name: 'Variables',
          show: true,
          data: this.wrapper.vars.custom,
          showBar: true
        },

        builtInVars: {
          name: 'Built In Variables',
          show: true,
          data: this.wrapper.vars.builtIn,
          showBar: true
        }
      }
    }
  },
  methods: {
    getAgentData() {
      let agents = [];

      for (const [_, info] of Object.entries(this.wrapper.snapshots)) {
        let cpuInfo = `CPU: ${info.cpuNum} cores / ${info.cpuUsage.toFixed(2)} %`
        let memInfo = `Memory: ${info.freeMemory} MB (free) / ${info.totalMemory} MB`
        let diskInfo = `Disk: ${info.freeDisk} MB free / ${info.totalDisk} MB`

        agents.push({
          key: info.name,
          value: `${cpuInfo} | ${memInfo} | ${diskInfo}`
        })
      }

      return agents
    },

    getPushData() {
      let push = this.wrapper.pushOrTag
      return [
        {
          key: 'Repo',
          value: this.wrapper.gitUrl
        },
        {
          key: 'Credential',
          value: this.wrapper.gitCredential
        },
        {
          key: 'Branch',
          value: push.branch
        },
        {
          key: 'Commits',
          value: push.commit_list
        }
      ]
    },

    getTagData() {
      let tag = this.wrapper.pushOrTag
      return [
        {
          key: 'Repo',
          value: this.wrapper.gitUrl
        },
        {
          key: 'Credential',
          value: this.wrapper.gitCredential
        },
        {
          key: 'Tag',
          value: tag.branch
        },
        {
          key: 'Commits',
          value: tag.commit_list,
        }
      ]
    },

    getPrData() {
      return [
        {
          key: 'Repo',
          value: this.wrapper.gitUrl
        },
        {
          key: 'Credential',
          value: this.wrapper.gitCredential
        },
        {
          key: 'Title',
          value: this.wrapper.prTitle
        },
        {
          key: 'Status',
          value: this.wrapper.isPrOpenedTrigger ? 'Opened' : (this.wrapper.isPrMergedTrigger ? 'Merged' : 'n/a')
        },
        {
          key: 'Message',
          value: this.wrapper.prMessage
        },
        {
          key: 'PR Number',
          value: this.wrapper.prNumber,
          value_link: this.wrapper.prUrl
        },
        {
          key: 'PR Head Repo/Branch',
          value: this.wrapper.prHeadRepo + ' / ' + this.wrapper.prHeadBranch
        },
        {
          key: 'PR Base Repo/Branch',
          value: this.wrapper.prBaseRepo + ' / ' + this.wrapper.prBaseBranch
        }
      ]
    },

    getRelatedJobsData() {
      let list = []
      for (let jobDesc of this.relatedJobs) {
        if (jobDesc.id === this.wrapper.id) {
          continue
        }

        let desc = `${jobDesc.flowName} / #${jobDesc.buildNumber}`
        let link = `#/flows/${jobDesc.flowName}/jobs/${jobDesc.buildNumber}`
        list.push({key: desc, value: '', key_link: link})
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center
}

.header {
  padding: 1px 10px 1px 10px;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  background-color: #E0E0E0;
}

.vertical-bar {
  display: flex;
  height: 20px;
  border-left: 1px solid #c6c6cb;
}
</style>
