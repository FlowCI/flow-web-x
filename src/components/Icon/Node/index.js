import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './nodeIcon.scss'

export const IconMapping = {
  'PENDING': <i className='icon icon-pending' />,
  'ENQUEUE': <i className='icon icon-pending' />,
  'RUNNING': <i className='icon icon-running' />,
  'SUCCESS': <i className='icon icon-check' />,
  'STOPPED': <i className='icon icon-stopped' />,
  'FAILURE': <i className='icon icon-failure' />,
  'TIMEOUT': <i className='icon icon-timeout' />,
}

export const STATUS = Object.keys(IconMapping)

export default class NodeIcon extends Component {
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
