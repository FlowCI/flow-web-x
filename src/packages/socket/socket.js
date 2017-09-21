import SockJS from 'sockjs-client'
import { Stomp } from 'stompjs/lib/stomp'

export default class SocketClient {
  constructor (url, headers) {
    this.wantSubscribe = []
    this.subscribed = {}
    this.connected = false
    // create socket connect
    this.socket = new SockJS(url)
    this.stompClient = Stomp.over(this.socket)
    // 取消控制台 debug 日志
    this.stompClient.debug = function () {}
    this.stompClient.connect(headers || {}, () => {
      this.connected = true
      this.refresh()
    })
  }

  getSubScribed (randomId) {
    return this.subscribed[randomId]
  }
  /**
   *
   * @param {string} chanel
   * @param {function} onMessage function ({ body (string): message }) {}
   */
  subscribe (...args) {
    const randomId = new Date().getTime()
    this.wantSubscribe.push({ randomId, args })
    this.refresh()
    return {
      unsubscribe: () => {
        const subscription = this.getSubScribed(randomId)
        subscription && subscription.unsubscribe()
      }
    }
  }

  refresh () {
    if (this.connected && this.wantSubscribe.length) {
      this.wantSubscribe.forEach(({ randomId, args }) => {
        this.subscribed[randomId] = this.stompClient.subscribe(...args)
      })
      this.wantSubscribe.length = 0
    }
  }

  /**
   * 断开连接
   */
  disconnect () {
    this.stompClient.disconnect()
    this.connected = false
  }
}
