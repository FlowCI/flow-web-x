const decoder = new TextDecoder("utf-8")

export class LogFromProto {

  constructor (msg) {
    this.msg = msg
  }

  // or step id
  get cmdId () {
    return this.msg.getCmdid()
  }

  get jobId () {
    return this.msg.getJobid()
  }

  get log () {
    // decode from uint8array
    return decoder.decode(this.msg.getContent())
  }
}

export class LogFromLoad {

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
