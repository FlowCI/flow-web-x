import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Subscriber extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    chanel: PropTypes.string.isRequired,
    /**
     * @param {object} data { body: string }
     */
    onMessage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    subscribe: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { subscribe } = this.context
    const { chanel, onMessage } = this.props
    this.subscription = subscribe(chanel, onMessage)
  }

  componentWillUnmount () {
    this.subscription.unsubscribe()
  }

  render () {
    return this.props.children
  }
}
