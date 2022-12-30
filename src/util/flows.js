import {JobWrapper} from './jobs'
import vars from './vars'
import cronstrue from "cronstrue/i18n";

export const GIT_TEST_FETCHING = 'FETCHING'
export const GIT_TEST_DONE = 'DONE'
export const GIT_TEST_ERROR = 'ERROR'

export const DEFAULT_YAML_NAME = '.flowci.yml'

export const DEFAULT_YAML_NAME_LEGACY = 'default'

const ratio = [0, 20, 50, 85, 100]
const ratioColors = ['red lighten-1', 'orange lighten-1', 'light-green darken-1', 'green darken-1']

export function getCronDesc(cron, local) {
  try {
    return cronstrue.toString(cron, {locale: local === 'cn' ? 'zh_CN' : 'en'})
  } catch (e) {
    return ''
  }
}

export function getColorOfSuccessRate(rate) {
  for (let i = 0; i < ratio.length - 1; i++) {
    const min = ratio[i]
    const max = ratio[i + 1]

    if (min < rate && rate <= max) {
      return ratioColors[i]
    }
  }

  return 'grey lighten-1'
}

export const gitTestStatus = {
  default: {
    class: [],
    icon: 'mdi-help-circle-outline',
    message: ''
  },

  // fetching status data was defined in the GitTestBtn component
  [GIT_TEST_FETCHING]: {
    class: [],
    icon: '',
    message: ''
  },

  [GIT_TEST_DONE]: {
    icon: 'flow-icon-circle-check',
    class: ['green--text'],
    message: ''
  },

  [GIT_TEST_ERROR]: {
    icon: 'flow-icon-cross',
    class: ['red--text'],
    message: 'Error'
  }
}

export class FlowWrapper {
  constructor(item) {
    this.flow = item
    this.flow.children = []
    this.latestJobWrapper = new JobWrapper({buildNumber: 0}) // JobWrapper
    this.successPercentage = 0
  }

  fetchVars(name) {
    let locally = this.flow.vars

    if (locally && locally[name]) {
      return locally[name].data
    }

    let variables = this.flow.readOnlyVars
    if (variables && variables[name]) {
      return variables[name]
    }

    return ''
  }

  get isGroup() {
    return this.flow.type === 'Group'
  }

  get isFlow() {
    return this.flow.type === 'Flow'
  }

  get isRoot() {
    return this.flow.id === "-1"
  }

  get rawInstance() {
    return this.flow
  }

  get id() {
    return this.flow.id
  }

  get name() {
    return this.flow.name
  }

  get type() {
    return this.flow.type
  }

  get parentId() {
    return this.flow.parentId
  }

  get parent() {
    return this.flow.parent
  }

  get children() {
    return this.flow.children
  }

  get webhookStatus() {
    const webhookStatus = this.flow.webhookStatus
    if (webhookStatus) {
      return Object.assign(webhookStatus, {
        icon: 'flow-icon-circle-check',
        color: 'green--text'
      })
    }

    return {
      icon: 'flow-icon-warning',
      color: 'yellow--text'
    }
  }

  get gitUrl() {
    return this.fetchVars(vars.git.url)
  }

  get secret() {
    return this.fetchVars(vars.git.credential)
  }

  get vars() {
    return this.flow.vars
  }

  get readOnlyVars() {
    return this.flow.readOnlyVars
  }

  get latestJob() {
    return this.latestJobWrapper
  }

  get successRate() {
    return this.successPercentage || 0.0
  }

  get successRateColor() {
    return getColorOfSuccessRate(this.successRate)
  }

  get isLoadYamlFromRepo() {
    return this.flow.yamlFromRepo
  }

  get yamlRepoBranch() {
    return this.flow.yamlRepoBranch
  }

  get cron() {
    return this.flow.cron
  }

  get jobTimeout() {
    return this.flow.jobTimeout
  }

  get stepTimeout() {
    return this.flow.stepTimeout
  }

  // set
  set rawInstance(flow) {
    this.flow = flow
  }

  set name(name) {
    this.flow.name = name
  }

  set gitUrl(url) {
    if (!this.flow.variables) {
      this.flow.variables = {}
    }

    this.flow.variables[vars.git.url] = url
  }

  set children(val) {
    this.flow.children = val
  }

  set ssh(sshObj) {
    this.sshObj = sshObj
  }

  set auth(authObj) {
    this.authObj = authObj
  }

  set secret(secretName) {
    if (!this.flow.variables) {
      this.flow.variables = {}
    }

    return this.flow.variables[vars.git.credential] = secretName
  }

  set cron(cron) {
    this.flow.cron = cron
  }

  set latestJob(jobObj) {
    this.latestJobWrapper = new JobWrapper(jobObj)
  }

  set successRate(rate) {
    this.successPercentage = rate
  }

  set isLoadYamlFromRepo(val) {
    this.flow.yamlFromRepo = val
  }

  set yamlRepoBranch(branch) {
    this.flow.yamlRepoBranch = branch
  }

  set jobTimeout(timeout) {
    this.flow.jobTimeout = timeout
  }

  set stepTimeout(timeout) {
    this.flow.stepTimeout = timeout
  }

  set parentId(id) {
    this.flow.parentId = id
  }
}

export const Root = new FlowWrapper({
  id: "-1",
  name: 'flows',
  type: 'Group'
})