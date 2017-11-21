import React, { Component } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import classnames from 'classnames'
import classes from 'rc-theme/input.scss'

/**
 * @example ./input.example.md
 */
export default class Input extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'lg']),

    className: PropTypes.string,
    inputClassName: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,

    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    /**
     * 是否未过校验
     */
    invalid: PropTypes.bool,
    /**
     * 与 button 组件不同。默认会将 spinner 设置在 rightIcon 上
     */
    loading: PropTypes.bool,
    spinner: PropTypes.node,

    // 待定 redux-form 属性支持
    /**
     * redux-form filed props
     * @see https://redux-form.com/7.1.2/docs/api/field.md/#input-props
     */
    input: PropTypes.object,
    /**
     * redux-form filed props
     * @see https://redux-form.com/7.1.2/docs/api/field.md/#meta-props
     */
    meta: PropTypes.object,

    /**
     * function (value) { } 与原生 onchange 不同，没有 event 参数
     */
    onChange: PropTypes.func,
    /**
     * function (event, value) { }, 先触发 onKeyup 事件后触发此方法
     */
    onPressEnter: PropTypes.func,
    /**
     * function (event, value) { }, 先触发 onKeyup 事件后触发此方法
     */
    onPressEsc: PropTypes.func,
    /**
     * @ignore
     * 由于 onPressEnter、onPressEsc 需要监听 onKeyUp 所以要显式调用 props.onKeyUp
     */
    onKeyUp: PropTypes.func,
  }

  static defaultProps = {
    classNames: classes,
    spinner: <i className='icon icon-loading' />,
  }

  getIcons () {
    const { loading, spinner, leftIcon, rightIcon } = this.props
    if (!loading || !spinner) {
      return { leftIcon, rightIcon }
    }
    if (!rightIcon && leftIcon) {
      return { leftIcon: spinner, rightIcon }
    }
    return { leftIcon, rightIcon: spinner }
  }

  handleKeyUp = (e) => {
    const { onKeyUp } = this.props
    onKeyUp && onKeyUp(e)
    switch (keycode(e)) {
      case 'enter':
        const { onPressEnter } = this.props
        onPressEnter && onPressEnter(e, e.target.value)
        break
      case 'esc':
        const { onPressEsc } = this.props
        onPressEsc && onPressEsc(e, e.target.value)
        break
    }
  }

  handleChange = (e) => {
    const { value } = e.target
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render () {
    const {
      className, inputClassName,
      classNames, size,
      disabled, readOnly,
      invalid,
      leftIcon: l, rightIcon: r, // eslint-disable-line no-unused-vars
      input, meta, spinner, // eslint-disable-line no-unused-vars
      loading, // eslint-disable-line no-unused-vars
      onPressEsc, // eslint-disable-line no-unused-vars
      onPressEnter, // eslint-disable-line no-unused-vars
      onKeyUp, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars

      ...other
    } = this.props

    const {
      leftIcon,
      rightIcon
    } = this.getIcons()

    return <span
      className={classnames(classNames.wrapper, className)}
    >
      {!!leftIcon && React.cloneElement(leftIcon, {
        className: classnames(classNames.left, leftIcon.props.className)
      })}
      {!!rightIcon && React.cloneElement(rightIcon, {
        className: classnames(classNames.right, rightIcon.props.className)
      })}
      <input {...other} className={classnames(classNames.input, inputClassName,
        classNames[size], {
          [classNames['has-left']]: !!leftIcon,
          [classNames['has-right']]: !!rightIcon,
          disabled: disabled,
          readonly: readOnly,
          invalid: invalid,
        })} disabled={disabled} readOnly={readOnly}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleChange}
      />
    </span>
  }
}
