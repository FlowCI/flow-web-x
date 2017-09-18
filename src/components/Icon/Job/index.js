import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BallPulse from '../Loading/BallPulse'

import classes from './jobIcon.scss'

export { classes }

export const IconMapping = {
  'CREATED': <BallPulse className='icon' />,
  'SESSION_CREATING': <BallPulse className='icon' />,
  'RUNNING': <i className='icon icon-running' />,
  'SUCCESS': <i className='icon icon-check' />,
  'FAILURE': <i className='icon icon-failure' />,
  'STOPPED': <i className='icon icon-stopped' />,
}

export const STATUS = Object.keys(IconMapping)

export default class JobIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf(STATUS).isRequired,
    className: PropTypes.string,
    colored: PropTypes.bool,
  }

  render () {
    const { status, className, colored } = this.props
    const icon = IconMapping[status]
    const cls = [classes.icon]
    className && cls.push(className)
    colored && cls.push(classes.colored)
    return <span className={cls.join(' ')}>{icon}</span>
  }
}
