import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import AutoLockScrolling from 'components/AutoLockScrolling'
import ModalChildWrapper from './childWrapper'

import classes from './wrapper.scss'

const containerClassName = {
  base: classes.container,
  afterOpen: classes.containerAfterOpen,
  beforeClose: classes.containerBeforeClose
}

const overlayClassName = {
  base: classes.overlay,
  afterOpen: classes.overlayAfterOpen,
  beforeClose: classes.overlayBeforeClose
}

const defaultClassNames = {
  container: containerClassName,
  overlay: overlayClassName,
  portal: classes.portal,
  bodyOpen: classes.bodyOpen,
}

export {
  defaultClassNames as classes
}

const closeTimeoutMS = 300
export default class ReactModalWrapper extends Component {
  /**
   * more props @see https://reactcommunity.org/react-modal/
   */
  static propTypes = {
    isOpen: PropTypes.bool,
    /**
     * 是否必须点击 关闭 按钮才能关闭
     */
    modal: PropTypes.bool,

    classNames: PropTypes.object,

    title: PropTypes.string.isRequired,
    children: PropTypes.node,

    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    classNames: defaultClassNames,
  }

  state = {
    /**
     * 保证 children 组件生命周期同视觉
     */
    closed: !this.props.isOpen
  }

  componentDidMount () {
    this.isMount = true
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      nextProps.isOpen ? this.openModal() : this.closeModal()
    }
  }

  componentWillUnmount () {
    this.isMount = false
  }

  safeSetClosed (closed) {
    if (this.isMount) {
      this.setState({ closed })
    }
  }

  openModal = () => {
    clearTimeout(this.closeTimer)
    this.safeSetClosed(false)
  }

  closeModal = () => {
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => {
      this.safeSetClosed(true)
    }, closeTimeoutMS)
  }

  render () {
    const {
      isOpen,
      children,
      title,
      modal,
      classNames,
      ...other,
    } = this.props
    const { closed } = this.state
    return (
      <ReactModal
        {...other}
        isOpen={isOpen}
        closeTimeoutMS={closeTimeoutMS}
        contentLabel={title}
        portalClassName={classNames.portal}
        bodyOpenClassName={classNames.bodyOpen}
        overlayClassName={classNames.overlay}
        className={classNames.container}
        shouldCloseOnOverlayClick={!modal}
      >
        <AutoLockScrolling lock={isOpen} />
        {!closed && <ModalChildWrapper isOpen={isOpen}>
          {children}
        </ModalChildWrapper>}
      </ReactModal>
    )
  }
}
