import React, { Component } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import classes from './checkbox.scss'

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),

    leftLabel: PropTypes.node,
    rightLabel: PropTypes.node,
    onChange: PropTypes.func,

    type: PropTypes.string.isRequired,
    checkedIcon: PropTypes.node.isRequired,
    unCheckedIcon: PropTypes.node.isRequired,
  }

  static defaultProps = {
    className: '',
    type: 'checkbox',
    checkedIcon: <i className='icon checked icon-checkbox-checked' />,
    unCheckedIcon: <i className='icon unchecked icon-checkbox-unchecked' />,
  }

  handleKeyUp = (e) => {
    if (keycode(e) === 'enter') {
      const { onChange, checked } = this.props
      e.target.checked = !checked
      onChange && onChange(e)
    }
  }

  render () {
    const {
      size, readOnly,
      checked, className,
      leftLabel, rightLabel,
      checkedIcon, unCheckedIcon,
      ...other
    } = this.props
    const icon = checked ? checkedIcon : unCheckedIcon

    const cls = [classes.checkbox, className]
    size && cls.push(classes[size])
    readOnly && cls.push('readonly')

    let left = icon
    if (leftLabel) {
      left = <span className={classes.left}>{leftLabel}</span>
    }
    const right = left === icon ? <span className={classes.right}>
      {rightLabel}
    </span> : icon

    return <label className={cls.join(' ')} tabIndex='0'
      onKeyUp={this.handleKeyUp}>
      <input {...other} className='hide'
        checked={checked} readOnly={readOnly} />
      {left}
      {right}
    </label>
  }
}
