export class LogWrapper {
  constructor (cmdId, body) {
    this.cmdId = cmdId
    this.body = body
    this.base64 = false
  }

  get id () {
    return this.cmdId
  }

  get log () {
    return this.body
  }

  get isBase64() {
    return this.base64
  }

  set isBase64(val) {
    this.base64 = val
  }
}
