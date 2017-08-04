import React, { Component } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import classes from './input.scss'

export default class Input extends Component {
  static propTypes = {
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    divider: PropTypes.bool,

    size: PropTypes.oneOf(['', 'lg', 'sm']).isRequired,

    className: PropTypes.string,

    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,

    onKeyUp: PropTypes.func,
    onPressEnter: PropTypes.func,
    onPressEsc: PropTypes.func,
  }

  static defaultProps = {
    size: '',
    className: '',
    divider: false,
  }

  handleKeyUp = (e) => {
    const { onKeyUp } = this.props
    onKeyUp && onKeyUp(e)
    switch (keycode(e)) {
      case 'enter':
        const { onPressEnter } = this.props
        // const { target: { value } } = e
        onPressEnter && onPressEnter(e)
        break
      case 'esc':
        const { onPressEsc } = this.props
        onPressEsc && onPressEsc(e)
        break
    }
  }

  render () {
    const {
      leftIcon, rightIcon,
      className, size,
      disabled, readOnly,
      divider,
      onKeyUp, // eslint-disable-line no-unused-vars
      onPressEnter, // eslint-disable-line no-unused-vars
      onPressEsc, // eslint-disable-line no-unused-vars
      ...other
    } = this.props

    const cls = [classes.wrapper, className]
    const inputCls = []

    if (size) {
      cls.push(classes[size] || '')
      inputCls.push(`input-${size}`)
    }

    !divider && cls.push(classes.noDivider)

    disabled && cls.push('disabled')
    readOnly && cls.push('readonly')

    return <span className={cls.join(' ')}>
      {!!leftIcon && <span className={classes.left}>{leftIcon}</span>}
      {divider && !!leftIcon && <span className='divider' />}
      <input {...other} className={inputCls.join(' ')}
        onKeyUp={this.handleKeyUp} />
      {divider && !!rightIcon && <span className='divider' />}
      {!!rightIcon && <span className={classes.right}>{rightIcon}</span>}
    </span>
  }
}
