import React, { Component } from 'react'
import { string, object, node } from 'prop-types'

import classes from './nav.scss'

export default class NavTabs extends Component {
  static propTypes = {
    classNames: object.isRequired,
    className: string,
    children: node,
  }

  static defaultProps = {
    classNames: classes,
  }

  render () {
    const { children, classNames, className } = this.props
    const cls = [classNames.navs]
    className && cls.push(className)

    return <div className={cls.join(' ')}>
      {children}
    </div>
  }
}
