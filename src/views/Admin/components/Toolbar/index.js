import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './toolbar.scss'

export default class AdminToolBar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  }

  render () {
    const { children, className } = this.props
    return <div className={classnames(classes.toolbar, className)}>
      {children}
    </div>
  }
}
