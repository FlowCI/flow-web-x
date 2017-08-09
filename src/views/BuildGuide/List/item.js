import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './list.scss'

export default class GuideListItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    const { children } = this.props
    return <li className={classes.item}>
      {children}
    </li>
  }
}
