import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './header.scss'
export default class FlowBuildSettingHeader extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    subTitle: PropTypes.node,
    children: PropTypes.node,
  }

  render () {
    const { title, subTitle, children } = this.props
    return <div className={classes.panel}>
      <h4>{title}</h4>
      <small>{subTitle}</small>
      {children}
    </div>
  }
}
