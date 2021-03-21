<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
      <v-data-table
          v-for="(value, key) in contextData"
          :key="key"
          :items="value.data"
          class="mb-2 bottom-border"
          v-show="value.show"
          hide-default-footer
          hide-default-header>

        <template v-slot:header="{}">
          <div class="header">{{ value.name }}</div>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td>
              <v-row no-gutters>
                <v-col cols="3" class="caption">
                  <span>{{ item.key }}</span>
                </v-col>
                <v-col class="caption">
                  <a v-if="item.link" :href="item.link" target="_blank">{{ item.value }}</a>
                  <span v-if="!item.link">{{ item.value }}</span>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
      </v-data-table>
  </div>

</template>

<script>
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

          variables: {
            name: 'Variables',
            show: true,
            data: this.wrapper.customVarList
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
            value: this.wrapper.branch
          },
          {
            key: 'Commits',
            value: this.wrapper.commitNum
          },
          {
            key: 'Last Commit ID',
            value: this.wrapper.commitId,
            link: this.wrapper.commitUrl
          },
          {
            key: 'Last Commit Message',
            value: this.wrapper.commitMsg
          }
        ]
      },

      getTagData() {
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
            value: this.wrapper.branch
          },
          {
            key: 'Commit ID',
            value: this.wrapper.commitId,
            link: this.wrapper.commitUrl
          },
          {
            key: 'Commit Message',
            value: this.wrapper.commitMsg
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
            value: this.wrapper.isPrOpenedTrigger ? 'Opened' : (this.wrapper.isPrMergedTrigger ? 'Merged' : '-')
          },
          {
            key: 'Message',
            value: this.wrapper.prMessage
          },
          {
            key: 'PR Number',
            value: this.wrapper.prNumber,
            link: this.wrapper.prUrl
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
</style>
