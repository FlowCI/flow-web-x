import moment from 'moment'
import { timeDurationInSeconds } from "./time"

const STATUS_PENDING = 'PENDING'
const STATUS_WAITING_AGENT = 'WAITING_AGENT'
const STATUS_RUNNING = 'RUNNING'
const STATUS_SUCCESS = 'SUCCESS'
const STATUS_SKIPPED = 'SKIPPED'
const STATUS_EXCEPTION = 'EXCEPTION'
const STATUS_KILLED = 'KILLED'
const STATUS_TIMEOUT = 'TIMEOUT'

const TYPE_STEP = 'STEP'
const TYPE_STAGE = 'STAGE'
const TYPE_FLOW = 'FLOW'
const TYPE_PARALLEL = 'PARALLEL'

export function forEachStep(wrapper, onStep) {
  onStep(wrapper)
  for (let next of wrapper.next) {
    forEachStep(next, onStep)
  }
}

/**
 * Wrapper for both ExecutedCmd and ExecutedLocalTask
 */
export class StepWrapper {
  constructor(step) {
    this.step = step
    this.stepName = step.name
    this.nextSteps = []
    this.parentStep = null
    this.isRootFlow = !step.parent;

    let path = step.nodePath;
    if (path) {
      let slashIndex = path.lastIndexOf('/')
      this.stepName = path.substring(slashIndex + 1)
    }
  }

  get rawInstance() {
    return this.step
  }

  get id() {
    return this.step.id
  }

  get startAt() {
    if (!this.step.startAt) {
      return '-'
    }
    return moment(this.step.startAt)
  }

  get finishAt() {
    if (!this.step.finishAt) {
      return '-'
    }
    return moment(this.step.finishAt)
  }

  get flow() {
    return this.step.flowId
  }

  get nextPaths() {
    return this.step.next
  }

  get next() {
    return this.nextSteps
  }

  get parent() {
    return this.parentStep
  }

  get parentPath() {
    return this.step.parent;
  }

  get isRoot() {
    return this.isRootFlow
  }

  get name() {
    return this.stepName.startsWith('parallel') ? 'parallel' : this.stepName
  }

  get path() {
    return this.step.nodePath
  }

  get status() {
    let status = mapping[this.step.status]
    return !status ? mapping.default : status
  }

  get isSuccessButFailure() {
    return this.step.allowFailure && this.step.status === STATUS_SUCCESS && this.step.code !== 0
  }

  get isTimeoutButAllowFailure() {
    return this.step.allowFailure && this.step.status === STATUS_TIMEOUT
  }

  get isSkippedOnCondition() {
    return this.step.status === STATUS_SKIPPED && this.step.error
  }

  get isFlow() {
    return this.step.type === TYPE_FLOW
  }

  get isParallel() {
    return this.step.type === TYPE_PARALLEL
  }

  get isStep() {
    return this.step.type === TYPE_STEP
  }

  get isStage() {
    return this.step.type === TYPE_STAGE
  }

  get error() {
    return this.step.error
  }

  get duration() {
    if (this.step.startAt && this.step.finishAt) {
      return timeDurationInSeconds(this.step.finishAt, this.step.startAt)
    }
    return '-'
  }

  get exitCode() {
    return this.step.code
  }

  get isPending() {
    return this.step.status === STATUS_PENDING
  }

  get isRunning() {
    return this.step.status === STATUS_RUNNING
  }

  get isFinished() {
    return isStepFinished(this.step)
  }

  set rawStatus(newStatus) {
    this.step.status = newStatus
  }

  set parent(p) {
    this.parentStep = p
  }
}

export function isStepFinished(step) {
  return step.status !== STATUS_PENDING && step.status !== STATUS_RUNNING
}

export const mapping = {
  default: {
    icon: 'flow-icon-stopped grey--text',
    text: 'skipped',
    config: {
      style: {
        fill: '#C6E5FF',
      }
    }
  },

  [STATUS_PENDING]: {
    icon: 'flow-icon-pending grey--text',
    text: 'pending',
    config: {
      style: {
        fill: '#BDBDBD',
      }
    }
  },

  [STATUS_WAITING_AGENT]: {
    icon: 'mdi-settings rotate blue--text',
    text: 'waiting for agent',
    config: {
      style: {
        fill: '#BBDEFB',
      }
    }
  },

  [STATUS_RUNNING]: {
    icon: 'mdi-settings rotate blue--text',
    text: 'running',
    config: {
      style: {
        fill: '#42A5F5',
      }
    }
  },

  [STATUS_SUCCESS]: {
    icon: 'flow-icon-check green--text',
    text: 'success',
    config: {
      style: {
        fill: '#66BB6A',
      }
    }
  },

  [STATUS_SKIPPED]: {
    icon: 'flow-icon-stopped grey--text',
    text: 'skipped',
    config: {
      style: {
        fill: '#B0BEC5',
      }
    }
  },

  [STATUS_EXCEPTION]: {
    icon: 'flow-icon-failure red--text',
    text: 'failure',
    config: {
      style: {
        fill: '#E53935',
      }
    }
  },

  [STATUS_KILLED]: {
    icon: 'flow-icon-stopped grey--text',
    text: 'killed',
    config: {
      style: {
        fill: '#B0BEC5',
      }
    }
  },

  [STATUS_TIMEOUT]: {
    icon: 'flow-icon-timeout orange--text',
    text: 'pending',
    config: {
      style: {
        fill: '#FFE0B2',
        stroke: '#FFFFFF'
      }
    }
  }
}
