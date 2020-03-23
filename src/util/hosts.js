export const HOST_TYPE_SSH = 'SSH'
export const HOST_TYPE_LOCAL_SOCKET = 'LocalUnixSocket'

export const HOST_STATUS_CONNECTED = 'Connected'
export const HOST_STATUS_DISCONNECTED = 'Disconnected'

const colors = {
  [HOST_STATUS_CONNECTED]: 'green lighten-1',
  [HOST_STATUS_DISCONNECTED]: 'grey'
}

export class HostWrapper {

  constructor (host) {
    this.host = host || {
      tags: [],
      maxSize: 10,
      type: HOST_TYPE_SSH,
      maxIdleSeconds: 3600,
      maxOfflineSeconds: 600
    }
    this.agents = []
  }

  get rawInstance () {
    return this.host
  }

  get isHost () {
    return true
  }

  get isDefaultLocal () {
    return this.host.type === HOST_TYPE_LOCAL_SOCKET
  }

  get id () {
    return this.host.id
  }

  get name () {
    return this.host.name
  }

  get tags () {
    return this.host.tags
  }

  get children () {
    return this.agents
  }

  get secret () {
    return this.host.secret
  }

  get type () {
    return this.host.type
  }

  get user () {
    return this.host.user
  }

  get status () {
    return this.host.status
  }

  get ip () {
    return this.host.ip
  }

  get maxSize () {
    return this.host.maxSize
  }

  get maxIdle () {
    return this.host.maxIdleSeconds / 60
  }

  get maxOffline () {
    return this.host.maxOfflineSeconds / 60
  }

  get color () {
    return colors[this.host.status]
  }

  get icon () {
    return 'mdi-server'
  }

  get error () {
    return this.host.error
  }

  set name (val) {
    this.host.name = val
  }

  set tags (tags) {
    this.host.tags = tags
  }

  set type (type) {
    this.host.type = type
  }

  set children (val) {
    this.agents = val
  }

  set secret (val) {
    this.host.secret = val
  }

  set user (val) {
    this.host.user = val
  }

  set ip (val) {
    this.host.ip = val
  }

  set maxSize (val) {
    this.host.maxSize = val
  }

  set maxIdle (val) {
    this.host.maxIdleSeconds = val * 60
  }

  set maxOffline (val) {
    this.host.maxOfflineSeconds = val * 60
  }
}
