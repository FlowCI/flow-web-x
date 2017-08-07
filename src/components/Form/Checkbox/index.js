import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './checkbox.scss'

const checkedIcon = <i className='icon checked icon-checkbox-checked' />
const unCheckedIcon = <i className='icon unchecked icon-checkbox-unchecked' />

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),

    leftLabel: PropTypes.node,
    rightLabel: PropTypes.node,
  }

  static defaultProps = {
    className: ''
  }

  render () {
    const {
      size, readOnly,
      checked, className,
      leftLabel, rightLabel,
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

    return <label className={cls.join(' ')}>
      <input {...other} type='checkbox' className='hide'
        checked={checked} readOnly={readOnly} />
      {left}
      {right}
    </label>
  }
}
