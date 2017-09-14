import { Component } from 'react'
import PropTypes from 'prop-types'

import SocketClient from '../socket'

export default class Socket extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    url: PropTypes.string.isRequired,
    headers: PropTypes.object,
  }

  static childContextTypes = {
    subscribe: PropTypes.func,
  }

  getChildContext () {
    return {
      subscribe: this.subscribe
    }
  }

  componentDidMount () {
    /**
     * 考虑到如果未有订阅情况下不会主动开启连接，所以在 didmount 时调用保证
     * didmount 时一定建立连接
     */
    this.getSocket()
  }

  componentWillUnmount () {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  getSocket () {
    if (!this.socket) {
      this.socket = new SocketClient(this.props.url, this.props.headers)
    }
    return this.socket
  }

  subscribe = (...args) => {
    const socket = this.getSocket()
    return socket.subscribe(...args)
  }

  render () {
    return this.props.children
  }
}
