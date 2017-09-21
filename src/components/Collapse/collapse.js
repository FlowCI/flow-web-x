import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TransitionGroup from 'react-transition-group/TransitionGroup'

import TransitionChild from './transition'

export default class Collapse extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    const { children } = this.props
    return <TransitionGroup>
      {!!children && <TransitionChild {...this.props} />}
    </TransitionGroup>
  }
}
