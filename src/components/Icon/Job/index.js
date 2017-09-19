import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BallPulse from './BallPulse'

import classes from './jobIcon.scss'

export const STATUS = [
  'CREATED',
  'SESSION_CREATING',
  'RUNNING',
  'SUCCESS',
  'FAILURE',
  'STOPPED',
]

export const IconMapping = {
  'CREATED': <BallPulse className='icon' />,
  'SESSION_CREATING': <BallPulse className='icon' />,
  'SUCCESS': <i className='icon icon-check' />,
  'FAILURE': <i className='icon icon-failure' />,
  'RUNNING': <i className='icon icon-running' />,
  'STOPPED': <i className='icon icon-stopped' />,
}

export default class JobIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf(STATUS).isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: ''
  }

  render () {
    const { status, className } = this.props
    const icon = IconMapping[status]
    return <span className={`${classes.icon} ${className}`}>{icon}</span>
  }
}
