import React, { Component } from 'react'
import { string, object, any, bool, node } from 'prop-types'

import { Link } from 'react-router'

import classes from './nav.scss'

export default class Nav extends Component {
  static propTypes = {
    classNames: object.isRequired,
    className: string,
    active: bool,

    children: node,
    component: any,
  }

  static defaultProps = {
    classNames: classes,
    component: Link,
  }

  render () {
    const {
      children, classNames,
      className, component,
      active,
      ...other
    } = this.props
    const cls = [classNames.nav]
    className && cls.push(className)
    active && cls.push(classNames.active)

    return React.createElement(component, {
      ...other,
      className: cls.join(' '),
    }, children)
  }
}
