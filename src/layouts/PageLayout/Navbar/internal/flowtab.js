import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'
import Icon from 'components/Icon/Flow'

import classes from './flowtab.scss'

export default class FlowTab extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    actived: PropTypes.bool,
  }

  render () {
    const { name, path, status, actived } = this.props
    const cls = [classes.tab, classes[status]]
    actived && cls.push('active')
    return <Link to={`/flows/${path}`}
      className={cls.join(' ')}>
      <Icon status={status} className={classes.icon} />{name}
    </Link>
  }
}
