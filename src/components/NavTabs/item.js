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

    const props = {
      ...other,
    }
    if (component === Link) {
      props.activeClassName = classNames.active
    } else if (active) {
      cls.push(classNames.active)
    }

    props.className = cls.join(' ')
    return React.createElement(component, props, children)
  }
}
