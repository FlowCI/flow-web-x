import moment from 'moment'

const STATUS_PENDING = 'PENDING'
const STATUS_RUNNING = 'RUNNING'
const STATUS_SUCCESS = 'SUCCESS'
const STATUS_SKIPPED = 'SKIPPED'
const STATUS_EXCEPTION = 'EXCEPTION'
const STATUS_KILLED = 'KILLED'
const STATUS_TIMEOUT = 'TIMEOUT'

export class StepWrapper {
  constructor(step, index) {
    this.step = step
    this.stepIndex = index

    let cmdId = atob(this.step.id)
    let dashIndex = cmdId.indexOf('-')
    let slashIndex = cmdId.lastIndexOf('/')

    this.flowName = cmdId.substring(0, dashIndex)
    this.stepName = cmdId.substring(slashIndex + 1)
  }

  get rawInstance() {
    return this.step
  }

  get id() {
    return this.step.id
  }

  get index() {
    return this.stepIndex
  }

  get startAt() {
    if (!this.step.startAt) {
      return '-'
    }
    return moment(this.step.startAt).format('kk:mm:ss SSS')
  }

  get finishAt() {
    if (!this.step.finishAt) {
      return '-'
    }
    return moment(this.step.finishAt).format('kk:mm:ss SSS')
  }

  get flow() {
    return this.flowName
  }

  get name() {
    return this.stepName
  }

  get status() {
    let status = mapping[this.step.status]
    return !status ? mapping.default : status
  }

  get isSuccessButFailure() {
    return this.step.allowFailure && this.step.status === STATUS_SUCCESS && this.step.code !== 0
  }

  get duration() {
    const start = moment(this.step.startAt)
    const end = moment(this.step.finishAt)
    return end.diff(start, 'seconds')
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
        stroke: '#FFFFFF'
      }
    }
  },

  [STATUS_PENDING]: {
    icon: 'flow-icon-pending grey--text',
    text: 'pending',
    config: {
      shape: 'circle',
      style: {
        fill: '#FFFFFF',
        stroke: '#757575'
      }
    }
  },

  [STATUS_RUNNING]: {
    icon: 'mdi-settings rotate blue--text',
    text: 'running',
    config: {
      shape: 'background-animate',
      style: {
        fill: '#E1F5FE',
        stroke: '#FFFFFF'
      }
    }
  },

  [STATUS_SUCCESS]: {
    icon: 'flow-icon-check green--text',
    text: 'success',
    config: {
      shape: 'circle',
      style: {
        fill: '#9CCC65',
        stroke: '#FFFFFF'
      }
    }
  },

  [STATUS_SKIPPED]: {
    icon: 'flow-icon-stopped grey--text',
    text: 'skipped',
    shape: 'circle',
    config: {
      shape: 'circle',
      style: {
        fill: '#B0BEC5',
        stroke: '#FFFFFF'
      }
    }
  },

  [STATUS_EXCEPTION]: {
    icon: 'flow-icon-failure red--text',
    text: 'failure',
    shape: 'circle',
    config: {
      shape: 'circle',
      style: {
        fill: '#E53935',
        stroke: '#FFFFFF'
      }
    }
  },

  [STATUS_KILLED]: {
    icon: 'flow-icon-stopped grey--text',
    text: 'killed',
    config: {
      shape: 'circle',
      style: {
        fill: '#B0BEC5',
        stroke: '#FFFFFF',
        lineWidth: 3,
      }
    }
  },

  [STATUS_TIMEOUT]: {
    icon: 'flow-icon-timeout orange--text',
    text: 'pending',
    shape: 'circle',
    config: {
      style: {
        fill: '#FFE0B2',
        stroke: '#FFFFFF'
      }
    }
  }
}
