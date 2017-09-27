import React, { Component } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import classes from './input.scss'

export { classes }

export default class Input extends Component {
  static propTypes = {
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    divider: PropTypes.bool,

    meta: PropTypes.object,
    /*
    * only this component support hg,
    */
    size: PropTypes.oneOf(['lg', 'sm', 'hg']),

    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,

    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    onPressEnter: PropTypes.func,
    onPressEsc: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    classNames: classes,
    divider: false,
  }

  state = {
    focus: false
  }

  handleKeyUp = (e) => {
    const { onKeyUp } = this.props
    onKeyUp && onKeyUp(e)
    switch (keycode(e)) {
      case 'enter':
        const { onPressEnter } = this.props
        onPressEnter && onPressEnter(e.target.value)
        break
      case 'esc':
        const { onPressEsc } = this.props
        onPressEsc && onPressEsc(e.target.value)
        break
    }
  }

  handleFocus = (e) => {
    this.setState({ focus: true })
    const { onFocus } = this.props
    onFocus && onFocus(e)
  }

  handleBlur = (e) => {
    this.setState({ focus: false })
    const { onBlur } = this.props
    onBlur && onBlur(e)
  }

  handleChange = (e) => {
    const { onChange } = this.props
    return onChange(e.target.value)
  }

  handleClick = (e) => {
    const { target } = e
    if (this.input) {
      this.input.focus()
      if (target !== this.input) {
        this.input.click()
      }
    }
  }

  render () {
    const {
      disabled, readOnly,
    } = this.props
    const { focus } = this.state
    const {
      leftIcon, rightIcon,
      className,
      classNames,
      size, divider,
      onChange,
      meta, // eslint-disable-line no-unused-vars
      onKeyUp, // eslint-disable-line no-unused-vars
      onPressEnter, // eslint-disable-line no-unused-vars
      onPressEsc, // eslint-disable-line no-unused-vars
      ...other
    } = this.props

    const cls = [classNames.wrapper, className]
    const inputCls = []

    if (size) {
      cls.push(classNames[size] || '')
    }

    !divider && cls.push(classNames.noDivider)

    focus && cls.push('focus')
    disabled && cls.push(classNames.disabled)
    readOnly && cls.push(classNames.readonly)

    return <div className={cls.join(' ')} onClick={this.handleClick}>
      {!!leftIcon && <span className={classes.left}>{leftIcon}</span>}
      {divider && !!leftIcon && <span className={classNames.divider} />}
      <input {...other} ref={(input) => { this.input = input }}
        className={inputCls.join(' ')}
        onKeyUp={this.handleKeyUp}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={onChange ? this.handleChange : undefined}
      />
      {divider && !!rightIcon && <span className={classNames.divider} />}
      {!!rightIcon && <span className={classes.right}>{rightIcon}</span>}
    </div>
  }
}
