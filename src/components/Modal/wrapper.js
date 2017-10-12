import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import AutoLockScrolling from 'components/AutoLockScrolling'

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
  }

  static defaultProps = {
    classNames: defaultClassNames,
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
    return (
      <ReactModal
        {...other}
        isOpen={isOpen}
        closeTimeoutMS={300}
        contentLabel={title}
        portalClassName={classNames.portal}
        bodyOpenClassName={classNames.bodyOpen}
        overlayClassName={classNames.overlay}
        className={classNames.container}
        shouldCloseOnOverlayClick={!modal}
      >
        <AutoLockScrolling lock={isOpen} />
        {children}
      </ReactModal>
    )
  }
}
