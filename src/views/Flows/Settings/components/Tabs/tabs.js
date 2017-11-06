import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './tabs.scss'

export default class FlowSettingTabs extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    const { children } = this.props
    return <div className={classes.tabs}>
      {children}
    </div>
  }
}
