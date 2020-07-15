<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- Item in job list table -->
  <!-- state, build number, commit(id, branch, message), by(user), time, re-run -->
  <v-row align="center" class="job-item">
    <v-col cols="1">
      <v-icon size="20" v-bind:class="[wrapper.status.class]">{{ wrapper.status.icon }}</v-icon>
    </v-col>

    <v-col cols="1">
      <span class="font-weight-bold"># {{ wrapper.buildNumber }}</span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon small class="ml-3" v-on="on">{{ wrapper.triggerIcon }}</v-icon>
        </template>
        <span>{{ wrapper.triggerText }}</span>
      </v-tooltip>

      <v-tooltip bottom v-if="wrapper.numOfArtifact > 0">
        <template v-slot:activator="{ on }">
          <v-icon small class="ml-3" v-on="on">mdi-package-variant-closed</v-icon>
        </template>
        <span>{{ wrapper.numOfArtifact }} {{ $t('job.artifact') }}</span>
      </v-tooltip>
    </v-col>

    <v-col cols="8">
      <!-- for push and tag -->
      <v-row align="center"
             no-gutters
             v-if="wrapper.isPushTrigger || wrapper.isTagTrigger || wrapper.hasGitCommitInfo">
        <v-col cols="4">
          <span class="font-weight-medium">{{ wrapper.branch }}</span>
        </v-col>

        <v-col cols="4">
          <v-list-item-subtitle>
            <div class="commit-text caption"> {{ wrapper.commitMsg }}</div>
            <a :href="wrapper.commitUrl" class="caption" target="_blank">{{ wrapper.commitId }}</a>
          </v-list-item-subtitle>
        </v-col>
      </v-row>

      <!-- for pr -->
      <v-row align-center
             no-gutters
             v-if="wrapper.isPrOpenedTrigger || wrapper.isPrMergedTrigger">
        <v-col cols="4">
          <v-list-item-subtitle>
            <div v-if="wrapper.prBaseRepo !== wrapper.prHeadRepo" class="caption">
              {{ wrapper.prBaseRepo }} &#x2190; {{ wrapper.prHeadRepo}}
            </div>
            <div class="caption">{{ wrapper.prBaseBranch }} &#x2190; {{ wrapper.prHeadBranch}}</div>
          </v-list-item-subtitle>
        </v-col>

        <v-col cols="6">
          <v-list-item-subtitle>
            <a :href="wrapper.prUrl" target="_blank" class="caption">#{{ wrapper.prNumber }}</a>
            <span class="ml-1 caption">{{ wrapper.prTitle }}</span>
          </v-list-item-subtitle>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="2" class="d-flex align-center">
      <div class="vertical-bar mr-4"></div>
      <div>
        <div>
          <v-icon small class="mr-2">mdi-clock-fast</v-icon>
          <span class="body-2">{{ wrapper.duration }} sec</span>
        </div>
        <div>
          <v-icon small class="mr-2">mdi-clock-outline</v-icon>
          <span class="body-2">{{ wrapper.fromNow }}</span>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { JobWrapper } from '@/util/jobs'

  export default {
    props: {
      job: {
        type: Object,
        required: true
      }
    },
    computed: {
      wrapper() {
        return new JobWrapper(this.job)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .job-item {
    min-height: 68px;
  }

  .commit-text {
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #4e4e53;
  }

  .vertical-bar {
    display: flex;
    height: 40px;
    border-left: 2px solid #c6c6cb;
  }
</style>
