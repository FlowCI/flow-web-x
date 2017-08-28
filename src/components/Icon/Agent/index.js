import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './icon.scss'

export default class AgentIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf(['OFFLINE', 'IDLE', 'RUNNING']).isRequired,
  }

  render () {
    const { status } = this.props
    let content = <i className={classes.line} />
    let colorClass = ''
    switch (status) {
      case 'OFFLINE':
        content = <i className='icon icon-off' />
        colorClass = classes.black
        break
      case 'RUNNING':
        colorClass = classes.green
        content = <span className={classes.dots}>
          <i />
          <i />
          <i />
        </span>
        break
      case 'IDLE':
        colorClass = classes.yellow
    }
    const cls = [classes.icon, status]
    colorClass && cls.push(colorClass)
    return <span className={cls.join(' ')}>
      {content}
    </span>
  }
}
