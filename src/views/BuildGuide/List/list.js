import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './list.scss'

export default class GuideList extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    const { children } = this.props
    return <ul className={classes.list}>
      {children}
    </ul>
  }
}
