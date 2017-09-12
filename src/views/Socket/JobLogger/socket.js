import { Component } from 'react'
import PropTypes from 'prop-types'

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default class JobLoggerSocket extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    url: PropTypes.string.isRequired,
  }

  static defaultProps = {
    url: `${__API__}/ws/web`
  }

  static childContextTypes = {
    stompClient: PropTypes.object,
  }

  getChildContext () {
    return {
      stompClient: this.stompClient
    }
  }

  componentDidMount () {
    const { url } = this.props
    const socket = new SockJS(url)
    this.socket = socket
    this.stompClient = Stomp.over(socket)
  }

  componentWillUnmount () {
    this.stompClient.disconnect(() => {
      this.socket.close()
    })
  }

  render () {
    const { children } = this.props
    return children
  }
}
