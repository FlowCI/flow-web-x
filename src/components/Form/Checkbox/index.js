import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './checkbox.scss'

export { classes }

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    size: PropTypes.oneOf(['sm', 'lg']),
    meta: PropTypes.object,

    leftLabel: PropTypes.node,
    rightLabel: PropTypes.node,
    onChange: PropTypes.func,

    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
    checkedIcon: PropTypes.node.isRequired,
    unCheckedIcon: PropTypes.node.isRequired,
  }

  static defaultProps = {
    checked: false,
    className: '',
    classNames: classes,
    type: 'checkbox',
    checkedIcon: <i className='icon checked icon-checkbox-checked' />,
    unCheckedIcon: <i className='icon unchecked icon-checkbox-unchecked' />,
  }

  handleChange = (e) => {
    const { onChange } = this.props
    return onChange(e.target.checked)
  }

  render () {
    const {
      size, readOnly,
      checked, className,
      classNames,
      leftLabel, rightLabel,
      checkedIcon, unCheckedIcon,
      onChange,
      meta, // eslint-disable-line no-unused-vars
      ...other
    } = this.props
    const icon = checked ? checkedIcon : unCheckedIcon

    const cls = [classNames.checkbox, className]
    size && cls.push(classNames[size])
    readOnly && cls.push(classNames.readonly)

    let left = icon
    let right
    if (leftLabel) {
      left = <span className={classNames.label}>{leftLabel}</span>
    } else if (rightLabel) {
      left = icon
      right = <span className={classNames.label}>
        {rightLabel}
      </span>
    }

    return <label className={cls.join(' ')}>
      <input {...other} className='hide'
        checked={checked}
        disabled={readOnly}
        onChange={onChange ? this.handleChange : undefined}
      />
      {left}
      {right}
    </label>
  }
}
