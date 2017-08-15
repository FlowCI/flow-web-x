import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './icon.scss'

export default class AgentIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf(['OFF', 'IDLE', 'BUSY']).isRequired,
  }

  render () {
    const { status } = this.props
    let content = <i className={classes.line} />
    switch (status) {
      case 'OFF':
        content = <i className='icon icon-off' />
        break
      case 'BUSY':
        content = <span className={classes.dots}>
          <i />
          <i />
          <i />
        </span>
        break
    }
    const cls = [classes.icon, classes[status]]
    return <span className={cls.join(' ')}>
      {content}
    </span>
  }
}
