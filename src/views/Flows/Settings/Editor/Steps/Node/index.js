import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Connector from '../Connector'
import classes from './node.scss'

export default class FlowNode extends Component {
  static propTypes = {
    children: PropTypes.node,

  }

  handleClick = (e) => {
    e.stopPropagation()
  }

  render () {
    const { children } = this.props
    return <span className={classes.node} onClick={this.handleClick}>
      <Connector />
      {children}
    </span>
  }
}
