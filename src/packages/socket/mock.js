function noop () {}

export default class SocketClientMock {
  subscribe () {
    return {
      unsubscribe: noop
    }
  }

  /**
   * 断开连接
   */
  disconnect () {
  }
}
