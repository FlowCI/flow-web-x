import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'

import classes from './button.scss'

export const className = classes

export default class IconButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNames: PropTypes.object,

    href: PropTypes.string,
    to: PropTypes.string,

    size: PropTypes.oneOf(['sm', 'lg']),
    // loading: PropTypes.bool,
    // disabled: PropTypes.bool,

    // onClick: PropTypes.func,
  }

  static defaultProps = {
    type: 'button',
    classNames: classes,
  }

  render () {
    const {
      className, classNames,
      children, size,
      // onClick,
      ...other,
    } = this.props

    const {
      to, href,
      // disabled,
    } = this.props

    const cls = ['btn', classNames.btn]

    className && cls.push(className)
    size && cls.push(`btn-${size}`)

    const isLink = !!(to || href)
    const props = {
      ...other,
      className: cls.join(' '),
    }
    isLink && (props.type = undefined)

    const elementClass = !isLink ? 'button' : (to ? Link : 'a')
    const content = <span className={classes.wrapper}>
      {children}
    </span>

    return React.createElement(elementClass, props, content)
  }
}
