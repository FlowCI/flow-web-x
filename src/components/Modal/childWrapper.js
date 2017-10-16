import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ModalChildWrapper extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
  }

  shouldComponentUpdate (nextProps, nextState) {
    /**
     * 关闭的时候不进行重新 render, 保证关闭动画时的窗口内容不变
     */
    const { isOpen } = nextProps
    return isOpen
  }

  render () {
    const { className, children } = this.props
    return <div className={className}>
      {children}
    </div>
  }
}
