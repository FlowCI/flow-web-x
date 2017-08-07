import React, { Component } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import classes from './checkbox.scss'

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    size: PropTypes.oneOf(['sm', 'lg']),

    leftLabel: PropTypes.node,
    rightLabel: PropTypes.node,
    onChange: PropTypes.func,

    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
    checkedIcon: PropTypes.node.isRequired,
    unCheckedIcon: PropTypes.node.isRequired,
  }

  static defaultProps = {
    className: '',
    classNames: classes,
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
      classNames,
      leftLabel, rightLabel,
      checkedIcon, unCheckedIcon,
      ...other
    } = this.props
    const icon = checked ? checkedIcon : unCheckedIcon

    const cls = [classNames.checkbox, className]
    size && cls.push(classNames[size])
    readOnly && cls.push(classNames.readonly)

    let left = icon
    if (leftLabel) {
      left = <span className={classNames.left}>{leftLabel}</span>
    }
    const right = left === icon ? <span className={classNames.right}>
      {rightLabel}
    </span> : icon

    return <label className={cls.join(' ')}>
      <input {...other} className='hide'
        checked={checked}
        disabled={readOnly}
      />
      {left}
      {right}
    </label>
  }
}
