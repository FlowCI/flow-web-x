import React, { Component } from 'react'
import PropTypes from 'prop-types'

import IconButton from 'components/IconButton'
import classes from './alert.scss'

const closeIcon = <i className='icon icon-cross' />
export { classes }
export default class Alert extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
    closable: PropTypes.bool,
    message: PropTypes.string.isRequired,
    showIcon: PropTypes.bool,
    /**
     * 是否不带阴影, true 是则不带，默认为 false
     */
    flat: PropTypes.bool,

    className: PropTypes.string,
    classNames: PropTypes.object,

    /**
     * 自动关闭延迟，设置为 0 时取消自动关闭，(调用 onRequestClose 方法)
     */
    autoHideDuration: PropTypes.number,

    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    type: 'info',
    classNames: classes,
  }

  componentDidMount () {
    const { autoHideDuration, onRequestClose } = this.props
    if (autoHideDuration > 0) {
      this.hideTimer = setTimeout(() => {
        onRequestClose && onRequestClose()
      }, autoHideDuration)
    }
  }

  componentWillUnmount () {
    this.hideTimer && clearTimeout(this.hideTimer)
  }

  /**
   * 暂时不实现
   */
  getIcon () {
  }

  getClose () {
    const { classNames, onRequestClose } = this.props
    return <IconButton className={classNames.close}
      size='lg' onClick={onRequestClose}>
      {closeIcon}
    </IconButton>
  }

  render () {
    const {
      classNames, className,
      type, flat,
      closable, message,
      showIcon,
    } = this.props

    const cls = [classNames.alert, classNames[type]]
    flat && cls.push(classNames.flat)
    className && cls.push(className)

    return <div className={cls.join(' ')}>
      {showIcon && this.getIcon()}
      {message}
      {closable && this.getClose()}
    </div>
  }
}
