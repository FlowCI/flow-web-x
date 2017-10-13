import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ModalChildWrapper extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    classNames: PropTypes.object,
  }

  shouldComponentUpdate (nextProps, nextState) {
    /**
     * 关闭的时候不进行重新 render, 保证关闭动画时的窗口内容不变
     */
    const { isOpen } = nextProps
    return isOpen
  }

  render () {
    const { classNames, children } = this.props
    return <div className={classNames.childWrapper}>
      {children}
    </div>
  }
}
