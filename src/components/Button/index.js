import React, { Component } from 'react'
import PropTypes from 'prop-types'

import toProps from 'promise-to-props'
import is from 'util/is'

import LoadingIcon from 'components/Icon/Loading'

import classes from './button.scss'

export const className = classes

export class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNames: PropTypes.object,

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
    const r = onClick && onClick(e)
    if (is.promise(r)) {
      const button = e.currentTarget
      // only to stop quickly click，it will set props.diabled when next render
      button.disabled = true
    }
  }

  render () {
    const {
      className, classNames, children,
      leftIcon, rightIcon,
      useSpinner, spinner,
      size, loading, disabled,
      onClick, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props

    const cls = ['btn', classNames.btn]

    className && cls.push(className)
    size && cls.push(classNames[size])
    loading && cls.push(classNames.loading)

    let left = leftIcon
    let right = rightIcon
    if (loading && useSpinner) {
      right ? (right = spinner) : (left = spinner)
    }

    return <button {...other}
      className={cls.join(' ')}
      disabled={disabled || loading}
      onClick={this.handleClick}>
      <span className={classNames.wrapper}>
        {!!left && <span className={classNames.left}>{left}</span>}
        <span className={classNames.content}>{children}</span>
        {!!right && <span className={classNames.right}>{right}</span>}
      </span>
    </button>
  }
}

export default toProps({ onClick: 'loading' })(Button)
