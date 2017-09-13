import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './header.scss'

export default class JobNodeHeader extends Component {
  static propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render () {
    const { active, status, name, onClick } = this.props
    const cls = [classes.header]
    active && cls.push(classes.active)
    status && cls.push(classes.status)
    return <div className={cls.join(' ')} onClick={onClick}>
      {name}
    </div>
  }
}
