export class LogWrapper {

  constructor(cmdId, content) {
    this.id = cmdId
    this.content = content
  }

  get cmdId () {
    return this.id
  }

  get log () {
    return this.content
  }
}
