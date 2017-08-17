import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './well.scss'

export default class Well extends Component {
  static propTypes = {
    value: PropTypes.any,
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,

    active: PropTypes.bool,
    onActive: PropTypes.func,
  }

  handleClick = (e) => {
    const { onActive, value } = this.props
    return onActive && onActive(value)
  }

  render () {
    const { active, icon, title, subTitle } = this.props

    const cls = [classes.wall]
    active && cls.push(classes.active)

    return <div className={cls.join(' ')} onClick={this.handleClick}>
      <span className={classes.icon}>{icon}</span>
      <div className={classes.wrapper}>
        <h4>{title}</h4>
        <small className={classes.subTitle}>{subTitle}</small>
      </div>
    </div>
  }
}
