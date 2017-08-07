import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ClickAwayListener from 'components/ClickAwayListener'

export default class SelectDropDown extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    className: PropTypes.string.isRequired,
  }

  render () {
    const { className, children, onRequestClose } = this.props
    return <ClickAwayListener onClickAway={onRequestClose}>
      <div className={className}>
        {children}
      </div>
    </ClickAwayListener>
  }
}
