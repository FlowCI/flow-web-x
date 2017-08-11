import React, { Component } from 'react'
import PropTypes from 'prop-types'

import toProps from 'promise-to-props'
import is from 'util/is'

import { Link } from 'react-router'
import LoadingIcon from 'components/Icon/Loading'

import classes from './button.scss'

export const className = classes

export class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNames: PropTypes.object,

    href: PropTypes.string,
    to: PropTypes.string,

    size: PropTypes.oneOf(['sm', 'lg']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,

    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,

    useSpinner: PropTypes.bool,
    spinner: PropTypes.node,

    onClick: PropTypes.func,
  }

  static defaultProps = {
    type: 'button',
    useSpinner: true,
    classNames: classes,
    spinner: <LoadingIcon />,
  }

  handleClick = (e) => {
    const { onClick } = this.props
    const r = onClick(e)
    if (is.promise(r)) {
      const button = e.currentTarget
      // only to stop quickly click，it will set props.diabled when next render
      button.disabled = true
    }
  }

  render () {
    const {
      className, classNames,
      leftIcon, rightIcon,
      useSpinner, spinner,
      children, size,
      loading, onClick,
      ...other,
    } = this.props

    const {
      to, href,
      disabled,
    } = this.props

    const cls = ['btn', classNames.btn]

    className && cls.push(className)
    size && cls.push(`btn-${size}`)
    loading && cls.push(classNames.loading)

    let left = leftIcon
    let right = rightIcon
    if (loading && useSpinner) {
      right ? (right = spinner) : (left = spinner)
    }

    const isLink = !!(to || href)
    const props = {
      ...other,
      className: cls.join(' '),
      disabled: disabled || loading,
      onClick: !!onClick && this.handleClick,
    }
    isLink && (props.type = undefined)

    const buttonChild = <span className={classNames.wrapper}>
      {!!left && <span className={classNames.left}>{left}</span>}
      <span className={classNames.content}>{children}</span>
      {!!right && <span className={classNames.right}>{right}</span>}
    </span>

    const elementClass = !isLink ? 'button' : (to ? Link : 'a')

    return React.createElement(elementClass, props, buttonChild)
  }
}

export default toProps({ onClick: 'loading' })(Button)
