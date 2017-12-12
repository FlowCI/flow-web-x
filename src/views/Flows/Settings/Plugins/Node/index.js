import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Connector from '../Connector'
import classes from './node.scss'

export default class FlowNode extends Component {
  static propTypes = {
    children: PropTypes.node,

  }

  render () {
    const { children } = this.props
    return <span className={classes.node}>
      <Connector />
      {children}
    </span>
  }
}
