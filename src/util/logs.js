export class LogWrapper {
  constructor (cmdId, body) {
    this.cmdId = cmdId
    this.body = body // binary
  }

  get id () {
    return this.cmdId
  }

  get log () {
    return this.body
  }
}
