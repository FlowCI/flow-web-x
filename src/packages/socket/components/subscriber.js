import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Subscriber extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    chanel: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    /**
     * @param {object} data { body: string }
     */
    onMessage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    subscribe: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { disabled } = this.props
    if (!disabled) {
      this.subscribe()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { disabled } = nextProps
    if (this.props.disabled !== disabled) {
      disabled ? this.unsubscribe() : this.subscribe()
    }
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  subscribe () {
    const { subscribe } = this.context
    const { chanel, onMessage } = this.props
    if (!this.subscription) {
      this.subscription = subscribe(chanel, onMessage)
    }
  }

  unsubscribe () {
    this.subscription && this.subscription.unsubscribe()
  }

  render () {
    return this.props.children
  }
}
