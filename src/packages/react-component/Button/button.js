import React, { Component } from 'react'
import PropTypes from 'prop-types'

import is from '../common/is'
import classnames from 'classnames'

import classes from 'rc-theme/button.scss'
/**
 * Button Component
 * @example ./button.example.md
 */
export default class Button extends Component {
  static propTypes = {
    /**
     * Button 内容
     */
    children: PropTypes.node,
    /**
     * html button type
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type
     */
    htmlType: PropTypes.string,
    /**
     * 按钮样式类型,
     */
    type: PropTypes.oneOf([
      'primary', 'danger',
      'success', 'secondary',
      'warning', 'text',
    ]),
    /**
     * css module object
     */
    classNames: PropTypes.object.isRequired,
    className: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    /**
     * 按钮大小
     */
    size: PropTypes.oneOf(['xs', 'sm', 'lg']),
    /**
     * 是否扁平样式
     */
    plain: PropTypes.bool,
    disabled: PropTypes.bool,
    /**
     *  按钮加载状态，如果为 true 时，则会将按钮设置成 disabled
     */
    loading: PropTypes.bool,

    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    /**
     * 当 loading 时显示的图标，默认使用 i.icon.icon-loading
     */
    spinner: PropTypes.node,

    /**
     * function (event) {}, 当返回值是 promise 时自动设置 disabled 为 true
     * 在下次 render 时，将根据 props.disabled 设置值
     * 当 disabled 或者 loading 时不触发
     */
    onClick: PropTypes.func,
  }

  static defaultProps = {
    classNames: classes,
    component: 'button',
    spinner: <i className='icon icon-loading' />,
    disabled: false,
    loading: false,
    plain: false,

  }

  handleClick = (e) => {
    const { loading, disabled, onClick } = this.props
    if (loading || disabled) {
      if (disabled) {
        e.preventDefault() // 防止 link 时 跳转
      }
      return
    }
    const r = onClick && onClick(e)
    if (is.promise(r)) {
      const button = e.currentTarget
      button.disabled = true
    }
  }

  getIcons () {
    const { loading, spinner, leftIcon, rightIcon } = this.props
    if (!loading || !spinner) {
      return { leftIcon, rightIcon }
    }
    if (!leftIcon && rightIcon) {
      return { leftIcon: leftIcon, rightIcon: spinner }
    }
    return { leftIcon: spinner, rightIcon }
  }

  renderContent () {
    const {
      children, classNames
    } = this.props
    const { leftIcon, rightIcon } = this.getIcons()
    // 由于 safari 浏览器 button 不支持 flex, inline-flex 所以包一层 span
    return <span className={classNames.wrapper}>
      {!!leftIcon && React.cloneElement(leftIcon, {
        className: classnames(classNames.left, leftIcon.props.className)
      })}
      {children}
      {!!rightIcon && React.cloneElement(rightIcon, {
        className: classnames(classNames.right, rightIcon.props.className)
      })}
    </span>
  }

  render () {
    const {
      classNames,
      className,
      component,
      loading,
      disabled,
      size,
      htmlType,
      type,
      plain,
      spinner, // eslint-disable-line no-unused-vars
      leftIcon, // eslint-disable-line no-unused-vars
      rightIcon, // eslint-disable-line no-unused-vars
      children, // eslint-disable-line no-unused-vars
      onClick, // eslint-disable-line no-unused-vars
      ...other
    } = this.props

    const props = {
      ...other,
      type: htmlType || (component === 'button' ? 'button' : ''),
      disabled: loading || disabled,
      className: classnames(classNames.btn, {
        'loading': loading,
        'disabled': disabled,
        [classNames.plain]: plain,
      }, classNames[size], classNames[type], className),
      onClick: this.handleClick,

    }
    return React.createElement(component, props, this.renderContent())
  }
}
