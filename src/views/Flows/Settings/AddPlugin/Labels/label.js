import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './labels.scss'

export default class FlowPluginLabel extends Component {
  static propTypes = {
    value: PropTypes.any,
    text: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onActive: PropTypes.func,
  }

  handleClick = () => {
    const { value, onActive } = this.props
    onActive && onActive(value)
  }

  render () {
    const { text, active } = this.props
    return <li className={classnames(classes.label, { active })}
      onClick={this.handleClick}>
      {text}
    </li>
  }
}
