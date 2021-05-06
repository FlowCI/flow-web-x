import vars from '@/util/vars'
import {timeDurationInSeconds, timeFormat, timeFormatFromNow} from "./time"

// status
const STATUS_UNKNOWN = 'UNKNOWN'
const STATUS_PENDING = 'PENDING'
const STATUS_LOADING = 'LOADING'
const STATUS_CREATED = 'CREATED'
const STATUS_QUEUED = 'QUEUED'
const STATUS_RUNNING = 'RUNNING'
const STATUS_SUCCESS = 'SUCCESS'
const STATUS_FAILURE = 'FAILURE'
const STATUS_CANCELLING = 'CANCELLING'
const STATUS_CANCELLED = 'CANCELLED'
const STATUS_TIMEOUT = 'TIMEOUT'

// triggers
export const TRIGGER_PUSH = 'PUSH'
export const TRIGGER_PR_OPENED = 'PR_OPENED'
export const TRIGGER_PR_MERGED = 'PR_MERGED'
export const TRIGGER_TAG = 'TAG'
export const TRIGGER_MANUAL = 'MANUAL'
export const TRIGGER_API = 'API'
export const TRIGGER_SCHEDULER = 'SCHEDULER'

export class JobWrapper {
  constructor(job) {
    this.job = job
  }

  get context() {
    return this.job.context || {}
  }

  get rawInstance() {
    return this.job
  }

  get errorMsg() {
    return this.job.message
  }

  get gitUrl() {
    return this.context[vars.git.url]
  }

  get gitCredential() {
    return this.context[vars.git.credential] || '-'
  }

  get commitId() {
    return this.context[vars.git.commit.id]
  }

  get commitMsg() {
    return this.context[vars.git.commit.message]
  }

  get commitUrl() {
    return this.context[vars.git.commit.url]
  }

  get commitNum() {
    return this.context[vars.git.commit.number]
  }

  get fromNow() {
    return timeFormatFromNow(this.job.createdAt)
  }

  get branch() {
    return this.context[vars.git.branch]
  }

  get buildNumber() {
    return this.job.buildNumber
  }

  get trigger() {
    return this.job.trigger || 'default'
  }

  get triggerText() {
    return mapping.trigger[this.trigger].text
  }

  get triggerIcon() {
    return mapping.trigger[this.trigger].icon
  }

  get triggerBy() {
    return this.context[vars.job.triggerBy] || '-'
  }

  get status() {
    if (!this.job.status) {
      return mapping.status.default
    }

    let status = mapping.status[this.job.status]

    if (!status) {
      return mapping.status.default
    }

    return status
  }

  get customVarList() {
    const contextAsPairList = []

    Object.keys(this.context).forEach(key => {
      if (!key.startsWith('FLOWCI_')) {
        contextAsPairList.push({key: key, value: this.context[key]})
      }
    })

    return contextAsPairList
  }

  get duration() {
    if (this.job.startAt && this.job.finishAt) {
      return timeDurationInSeconds(this.job.finishAt, this.job.startAt)
    }

    return 0
  }

  get finishedAtInStr() {
    if (!this.isFinished) {
      return '-'
    }

    if (this.job.finishAt) {
      return timeFormat(this.job.finishAt)
    }

    return '-'
  }

  get isFinished() {
    return this.job.status === STATUS_CANCELLED ||
      this.job.status === STATUS_SUCCESS ||
      this.job.status === STATUS_FAILURE ||
      this.job.status === STATUS_TIMEOUT
  }

  get snapshots() {
    return this.job.snapshots || {
      '-': {
        name: '-',
        os: '-',
        cpuNum: 0,
        cpuUsage: 0,
        freeMemory: 0,
        totalMemory: 0,
        freeDisk: 0,
        totalDisk: 0
      }
    }
  }

  get numOfArtifact() {
    return this.job.numOfArtifact || 0
  }

  get isYamlFromRepo() {
    return this.job.yamlFromRepo
  }

  get yamlRepoBranch() {
    return this.job.yamlRepoBranch
  }

  get prTitle() {
    return this.context[vars.git.pr.title]
  }

  get prMessage() {
    return this.context[vars.git.pr.message]
  }

  get prUrl() {
    return this.context[vars.git.pr.url]
  }

  get prNumber() {
    return this.context[vars.git.pr.number]
  }

  get prHeadRepo() {
    return this.context[vars.git.pr.head_repo]
  }

  get prHeadBranch() {
    return this.context[vars.git.pr.head_branch]
  }

  get prBaseRepo() {
    return this.context[vars.git.pr.base_repo]
  }

  get prBaseBranch() {
    return this.context[vars.git.pr.base_branch]
  }

  get hasGitCommitInfo() {
    return this.context[vars.git.commit.id]
      && this.context[vars.git.commit.message]
  }

  get isPushTrigger() {
    return this.trigger === TRIGGER_PUSH
  }

  get isTagTrigger() {
    return this.trigger === TRIGGER_TAG
  }

  get isPrOpenedTrigger() {
    return this.trigger === TRIGGER_PR_OPENED
  }

  get isPrMergedTrigger() {
    return this.trigger === TRIGGER_PR_MERGED
  }

  get isRunning() {
    return this.status.text === STATUS_RUNNING
  }
}

export const mapping = {

  // job status mapping
  status: {
    default: {
      icon: 'mdi-sitemap',
      class: ['grey--text'], // for icon color
      text: STATUS_UNKNOWN,
      bg: 'grey lighten-1' // for job info bar
    },

    [STATUS_PENDING]: {
      icon: 'flow-icon-pending',
      class: 'grey--text',
      text: 'Pending',
      bg: 'grey'
    },

    [STATUS_LOADING]: {
      icon: 'mdi-git',
      class: 'grey--text',
      text: 'Loading',
      bg: 'grey'
    },

    [STATUS_CREATED]: {
      icon: 'flow-icon-pending',
      class: 'grey--text',
      text: 'Created',
      bg: 'grey'
    },

    [STATUS_QUEUED]: {
      icon: 'mdi-refresh',
      class: ['blue--text text--lighten-1', 'rotate'],
      text: 'Enqueue',
      bg: '#42A5F5',
      rotate: true
    },

    [STATUS_RUNNING]: {
      icon: 'mdi-settings',
      class: ['blue--text text--lighten-1', 'rotate'],
      text: 'Running',
      bg: '#42A5F5',
      rotate: true
    },

    [STATUS_SUCCESS]: {
      icon: 'mdi-check-circle',
      class: 'green--text',
      text: 'Success',
      bg: '#66BB6A'
    },

    [STATUS_FAILURE]: {
      icon: 'mdi-close-circle-outline',
      class: 'red--text text--darken-1',
      text: 'Failure',
      bg: '#E53935'
    },

    [STATUS_CANCELLING]: {
      icon: 'mdi-cancel',
      class: ['grey--text', 'rotate'],
      text: 'Cancelling',
      bg: '#B0BEC5',
      rotate: true
    },

    [STATUS_CANCELLED]: {
      icon: 'mdi-cancel',
      class: '',
      text: 'Cancelled',
      bg: '#B0BEC5'
    },

    [STATUS_TIMEOUT]: {
      icon: 'mdi-clock-alert-outline',
      class: 'orange--text text--darken-1',
      text: 'Timeout',
      bg: '#FB8C00'
    }
  },

  // job trigger mapping
  trigger: {
    default: {
      text: 'push',
      icon: 'flow-icon-git-commit'
    },

    [TRIGGER_PUSH]: {
      text: 'push',
      icon: 'flow-icon-git-commit'
    },

    [TRIGGER_PR_OPENED]: {
      text: 'pull request open',
      icon: 'flow-icon-git-pull-request'
    },

    [TRIGGER_PR_MERGED]: {
      text: 'pull request close',
      icon: 'flow-icon-git-merge'
    },

    [TRIGGER_TAG]: {
      text: 'tag',
      icon: 'flow-icon-tag'
    },

    [TRIGGER_MANUAL]: {
      text: 'manual',
      icon: 'flow-icon-drag'
    },

    [TRIGGER_API]: {
      text: 'api',
      icon: 'flow-icon-code'
    },

    [TRIGGER_SCHEDULER]: {
      text: 'scheduler',
      icon: 'mdi-alarm'
    }
  }
}
