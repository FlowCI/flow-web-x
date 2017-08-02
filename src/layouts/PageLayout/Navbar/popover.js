import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ClickAwayListener from 'components/ClickAwayListener'

import classes from './popover.scss'

export default class Popover extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,

    children: PropTypes.node.isRequired,

    className: PropTypes.string,
    onRequestClose: PropTypes.func,
  }

  static defaultProps = {
    className: ''
  }

  renderPopover () {
    const { children, className, onRequestClose } = this.props
    return <div className={`${classes.popover} ${className}`}>
      <ClickAwayListener onClickAway={onRequestClose}>
        {children}
      </ClickAwayListener>
    </div>
  }

  render () {
    const { open } = this.props
    return open ? this.renderPopover() : null
  }
}
