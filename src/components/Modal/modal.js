import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Wrapper, { classes as WrapperClass } from './wrapper'
import IconButton from 'components/IconButton'

import classes from './modal.scss'

const defaultClassName = {
  ...WrapperClass,
  ...classes,
}
export {
  defaultClassName as classes
}
export default class Modal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    modal: PropTypes.bool,
    children: PropTypes.node,
    classNames: PropTypes.object.isRequired,
    footer: PropTypes.node,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    classNames: defaultClassName,
  }

  render () {
    const {
      classNames, footer, title,
      modal, children, onRequestClose,
    } = this.props

    return <Wrapper {...this.props} footer={undefined}>
      <h3 className={classNames.header}>
        {title}
        {!modal && <IconButton className={classNames.close}
          onClick={onRequestClose}>
          <i className='icon icon-cross' />
        </IconButton>}
      </h3>
      <div className={classNames.body}>
        {children}
      </div>
      {!!footer && <div className={classNames.footer}>
        {footer}
      </div>}
    </Wrapper>
  }
}
