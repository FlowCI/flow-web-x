<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- Item in job list table -->
  <!-- state, build number, commit(id, branch, message), by(user), time, re-run -->
  <v-row align="center" class="job-item">
    <v-col cols="1">
      <v-icon small v-bind:class="[wrapper.status.class]">{{ wrapper.status.icon }}</v-icon>
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
      <v-row align-center v-if="wrapper.isPushTrigger || wrapper.isTagTrigger || wrapper.hasGitCommitInfo">
        <v-col cols="4">
          <v-list-item-subtitle>
            <i>{{ wrapper.branch }}</i>
          </v-list-item-subtitle>
        </v-col>

        <v-flex cols="4">
          <v-list-item-subtitle>
            <a :href="wrapper.commitUrl" target="_blank">{{ wrapper.commitId }}</a>
            <div class="commit-text"> {{ wrapper.commitMsg }}</div>
          </v-list-item-subtitle>
        </v-flex>
      </v-row>

      <!-- for pr -->
      <v-row align-center v-if="wrapper.isPrOpenedTrigger || wrapper.isPrMergedTrigger">
        <v-col cols="4">
          <v-list-item-subtitle>
            <div v-if="wrapper.prBaseRepo !== wrapper.prHeadRepo">
              {{ wrapper.prBaseRepo }} &#x2190; {{ wrapper.prHeadRepo}}
            </div>
            <div>{{ wrapper.prBaseBranch }} &#x2190; {{ wrapper.prHeadBranch}}</div>
          </v-list-item-subtitle>
        </v-col>

        <v-col cols="6">
          <v-list-item-subtitle>
            <a :href="wrapper.prUrl" target="_blank">#{{ wrapper.prNumber }}</a>
            <span class="ml-1">{{ wrapper.prTitle }}</span>
          </v-list-item-subtitle>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="2">
      <div>
        <v-icon small class="mr-2">mdi-clock-fast</v-icon>
        <span>{{ wrapper.duration }} sec</span>
      </div>
      <div>
        <v-icon small class="mr-2">mdi-clock-outline</v-icon>
        <span>{{ wrapper.fromNow }}</span>
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
      wrapper () {
        return new JobWrapper(this.job)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .job-item {
    min-height: 65px;
  }

  .commit-text {
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
