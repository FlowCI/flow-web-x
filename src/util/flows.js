import {JobWrapper} from './jobs'
import vars from './vars'
import cronstrue from "cronstrue/i18n";

export const GIT_TEST_FETCHING = 'FETCHING'
export const GIT_TEST_DONE = 'DONE'
export const GIT_TEST_ERROR = 'ERROR'

const ratio = [0, 20, 50, 85, 100]
const ratioColors = ['red lighten-1', 'orange lighten-1', 'light-green darken-1', 'green darken-1']

export function getCronDesc(cron, local) {
  try {
    return cronstrue.toString(cron, {locale: local === 'cn' ? 'zh_CN' : 'en'})
  } catch (e) {
    return ''
  }
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

export function toWrapperList(flows) {
  let list = []
  for (let flow of flows) {
    list.push(new FlowWrapper(flow))
  }
  return list
}

export class FlowWrapper {
  constructor(flow) {
    this.flow = flow
    this.latestJobWrapper = new JobWrapper({buildNumber: 0}) // JobWrapper
    this.successPercentage = 0
    this.sshObj = {
      privateKey: '',
      publicKey: ''
    }
    this.authObj = {
      username: '',
      password: ''
    }
  }

  fetchVars(name) {
    let locally = this.flow.locally

    if (locally && locally[name]) {
      return locally[name].data
    }

    let variables = this.flow.variables
    if (variables && variables[name]) {
      return variables[name]
    }

    return ''
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

  get ssh() {
    return this.sshObj
  }

  get auth() {
    return this.authObj
  }

  get variables() {
    return this.flow.variables
  }

  get hasGitUrl() {
    return this.gitUrl !== ''
  }

  get hasSSH() {
    return this.ssh.privateKey !== '' && this.ssh.publicKey !== ''
  }

  get hasAuth() {
    return this.authObj.username !== '' && this.authObj.password !== ''
  }

  get latestJob() {
    return this.latestJobWrapper
  }

  get successRate() {
    return this.successPercentage || 0
  }

  get successRateColor() {
    for (let i = 0; i < ratio.length - 1; i++) {
      const min = ratio[i]
      const max = ratio[i + 1]
      const rate = this.successRate

      if (min < rate && rate <= max) {
        return ratioColors[i]
      }
    }

    return 'grey lighten-1'
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
}
