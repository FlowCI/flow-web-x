export class LogWrapper {

  constructor (msg) {
    this.msg = msg
  }

  get id () {
    return this.msg.getCmdid()
  }

  get jobId () {
    return this.msg.getJobid()
  }

  get log () {
    return this.msg.getContent()
  }
}
