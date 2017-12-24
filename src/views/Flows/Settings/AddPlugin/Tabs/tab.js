import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './tabs.scss'
import classnames from 'classnames'

export default class AddPluginsTab extends Component {
  static propTypes = {
    value: PropTypes.any,
    active: PropTypes.bool,
    children: PropTypes.node,
    onActive: PropTypes.func,
  }

  handleClick = () => {
    const { value, onActive } = this.props
    onActive && onActive(value)
  }

  render () {
    const { children, active } = this.props
    return <li className={classnames(classes.tab, { active: active })}
      onClick={this.handleClick}>
      {children}
    </li>
  }
}
