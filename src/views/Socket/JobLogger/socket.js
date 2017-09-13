import { Component } from 'react'
import PropTypes from 'prop-types'

import SockJS from 'sockjs-client'
import { Stomp } from 'stompjs/lib/stomp'

const url = `${__API__}/ws/web`
export default class JobLoggerSocket extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
  }

  static childContextTypes = {
    subscribe: PropTypes.func,
  }

  getChildContext () {
    return {
      subscribe: this.subscribe
    }
  }

  constructor (props, child, context) {
    super(props, child, context)

    this.wantSubscribe = []
    this.subscribed = {}
  }

  componentDidMount () {
    const socket = new SockJS(url)
    this.socket = socket
    this.stompClient = Stomp.over(socket)
    this.stompClient.connect({}, () => {
      this.connected = true
      this.refreshSubscribe()
    })
  }

  componentWillUnmount () {
    this.stompClient ? this.stompClient.disconnect() : this.socket.close()

    this.stompClient = undefined
    this.socket = undefined
  }

  getSubScribed (randomId) {
    return this.subscribed[randomId]
  }

  subscribe = (...args) => {
    const randomId = new Date().getTime() + ''
    this.wantSubscribe.push({ randomId, args })
    const timer = setTimeout(this.refreshSubscribe, 0)
    return {
      unsubscribe: () => {
        const subscription = this.getSubScribed(randomId)
        subscription && subscription.unsubscribe()
        /**
         * 理论上是不需要加取消的，防止某些情况下订阅后，同步调取消订阅
         */
        clearTimeout(timer)
      }
    }
  }

  refreshSubscribe = () => {
    if (this.stompClient && this.connected && this.wantSubscribe.length) {
      this.wantSubscribe.forEach(({ randomId, args }) => {
        this.subscribed[randomId] = this.stompClient.subscribe(...args)
      })
      this.wantSubscribe.length = 0
    }
  }

  render () {
    const { children } = this.props
    return children
  }
}
