import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from 'rc-theme/select.scss'

export default class Option extends Component {
  static propTypes = {
    value: PropTypes.any,
    label: PropTypes.string,

    className: PropTypes.string,
    children: PropTypes.node,

    disabled: PropTypes.bool,
    /**
     * @ignore 由父类传递，不需要显式填写
    */
    selected: PropTypes.bool,
    /**
     * @ignore 由父类传递，不需要显式填写
     * function (value, selected) { }
     */
    onSelect: PropTypes.func,
  }

  getLabel () {
    const { label, value } = this.props
    // value 可能不是期望的值.
    return label || value
  }

  handleClick = () => {
    const { onSelect, disabled, selected, value } = this.props
    if (disabled || !onSelect) {
      return
    }
    onSelect(value, !selected)
  }

  render () {
    const {
      children, className,
      disabled, selected
    } = this.props
    return <li className={classnames(classes.option, className, {
      disabled: disabled,
      selected: selected,
    })} onClick={this.handleClick}>
      {children || this.getLabel()}
    </li>
  }
}
