import { JobWrapper } from './jobs'
import vars from './vars'

export const GIT_TEST_FETCHING = 'FETCHING'
export const GIT_TEST_DONE = 'DONE'
export const GIT_TEST_ERROR = 'ERROR'

export const gitTestStatus = {
  default: {
    class: [],
    icon: 'mdi-help-circle-outline',
    message: ''
  },

  // fetching status data was defined in the GitTestBtn component
  [ GIT_TEST_FETCHING ]: {
    class: [],
    icon: '',
    message: ''
  },

  [ GIT_TEST_DONE ]: {
    icon: 'flow-icon-circle-check',
    class: [ 'green--text' ],
    message: ''
  },

  [ GIT_TEST_ERROR ]: {
    icon: 'flow-icon-cross',
    class: [ 'red--text' ],
    message: 'Error'
  }
}

export function toWrapperList (flows) {
  let list = []
  for (let flow of flows) {
    list.push(new FlowWrapper(flow))
  }
  return list
}

export class FlowWrapper {
  constructor (flow) {
    this.flow = flow
    this.latestJobWrapper = new JobWrapper({}) // JobWrapper
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

    if (locally && locally[ name ] ) {
      return locally[ name ].data
    }

    let variables = this.flow.variables
    if (variables && variables[ name ]) {
      return variables[ name ]
    }

    return ''
  }

  get rawInstance () {
    return this.flow
  }

  get id () {
    return this.flow.id
  }

  get name () {
    return this.flow.name
  }

  get webhook () {
    return this.fetchVars(vars.flow.webhook) || ''
  }

  get webhookStatus () {
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

  get gitUrl () {
    return this.fetchVars(vars.git.url)
  }

  get secret () {
    return this.fetchVars(vars.git.credential)
  }

  get ssh () {
    return this.sshObj
  }

  get auth () {
    return this.authObj
  }

  get variables () {
    return this.flow.variables
  }

  get hasGitUrl () {
    return this.gitUrl !== ''
  }

  get hasSSH () {
    return this.ssh.privateKey !== '' && this.ssh.publicKey !== ''
  }

  get hasAuth () {
    return this.authObj.username !== '' && this.authObj.password !== ''
  }

  get latestJob () {
    return this.latestJobWrapper
  }

  get successRate () {
    return this.successPercentage
  }

  get isLoadYamlFromRepo () {
    return this.flow.isYamlFromRepo
  }

  get yamlRepoBranch () {
    return this.flow.yamlRepoBranch
  }

  // set

  set name (name) {
    this.flow.name = name
  }

  set gitUrl (url) {
    if (!this.flow.variables) {
      this.flow.variables = {}
    }

    this.flow.variables[ vars.git.url ] = url
  }

  set ssh (sshObj) {
    this.sshObj = sshObj
  }

  set auth (authObj) {
    this.authObj = authObj
  }

  set secret (secretName) {
    if (!this.flow.variables) {
      this.flow.variables = {}
    }

    return this.flow.variables[ vars.git.credential ] = secretName
  }

  set latestJob (jobObj) {
    this.latestJobWrapper = new JobWrapper(jobObj)
  }

  set successRate (rate) {
    this.successPercentage = rate
  }

  set isLoadYamlFromRepo (val) {
    this.flow.isYamlFromRepo = val
  }

  set yamlRepoBranch (branch) {
    this.flow.yamlRepoBranch = branch
  }
}
