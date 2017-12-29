import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './header.scss'
export default class FlowSettingPanelHeader extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    className: PropTypes.string,
    subTitle: PropTypes.node,
    children: PropTypes.node,
  }

  render () {
    const { title, subTitle, children, className } = this.props
    return <div className={classnames(classes.panel, className)}>
      <h4>{title}</h4>
      <small>{subTitle}</small>
      {children}
    </div>
  }
}
