import { Component } from 'react'
import { node } from 'prop-types'

export default class CoreLayout extends Component {
  static propTypes = {
    children: node.isRequired,
  }

  render () {
    const { children } = this.props
    return children
  }
}
