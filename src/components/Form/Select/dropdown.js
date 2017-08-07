import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class SelectDropDown extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string.isRequired,
  }

  render () {
    const { className, children, } = this.props
    return <div className={className}>
      {children}
    </div>
  }
}
