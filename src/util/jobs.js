import vars from '@/util/vars'
import { timeDurationInSeconds, timeFormat, timeFormatFromNow } from "./time"

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

    get agentInfo() {
        return this.job.agentInfo || {
            name: '-',
            os: '-',
            cpu: 0,
            freeMemory: 0,
            totalMemory: 0,
            freeDisk: 0,
            totalDisk: 0
        }
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
            class: ['grey--text'],
            text: STATUS_UNKNOWN,
            bg: 'grey lighten-1'
        },

        [STATUS_PENDING]: {
            icon: 'flow-icon-pending',
            class: 'grey--text',
            text: STATUS_PENDING,
            bg: 'grey'
        },

        [STATUS_LOADING]: {
            icon: 'mdi-git',
            class: 'grey--text',
            text: STATUS_LOADING,
            bg: 'grey'
        },

        [STATUS_CREATED]: {
            icon: 'flow-icon-pending',
            class: 'grey--text',
            text: STATUS_CREATED,
            bg: 'grey'
        },

        [STATUS_QUEUED]: {
            icon: 'mdi-refresh',
            class: ['blue--text', 'rotate'],
            text: STATUS_QUEUED,
            bg: 'light-blue lighten-1'
        },

        [STATUS_RUNNING]: {
            icon: 'mdi-settings',
            class: ['blue--text', 'rotate'],
            text: STATUS_RUNNING,
            bg: 'light-blue lighten-1'
        },

        [STATUS_SUCCESS]: {
            icon: 'flow-icon-check',
            class: 'green--text',
            text: STATUS_SUCCESS,
            bg: 'green'
        },

        [STATUS_FAILURE]: {
            icon: 'flow-icon-failure',
            class: 'red--text',
            text: STATUS_FAILURE,
            bg: 'red'
        },

        [STATUS_CANCELLING]: {
          icon: 'flow-icon-stopped',
          class: ['grey--text', 'rotate'],
          text: STATUS_CANCELLING,
          bg: 'blue-grey'
        },

        [STATUS_CANCELLED]: {
            icon: 'flow-icon-stopped',
            class: 'grey--text',
            text: STATUS_CANCELLED,
            bg: 'blue-grey'
        },

        [STATUS_TIMEOUT]: {
            icon: 'flow-icon-timeout',
            class: 'orange--text',
            text: STATUS_TIMEOUT,
            bg: 'orange'
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
            icon: 'flow-icon-stopwatch'
        }
    }
}
