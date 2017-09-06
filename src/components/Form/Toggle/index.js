import React, { Component } from 'react'
import { object, string, func, bool, oneOf } from 'prop-types'

import classes from './toggle.scss'

export default class Toggle extends Component {
  static propTypes = {
    onLabel: string.isRequired,
    offLabel: string.isRequired,
    checked: bool,

    size: oneOf(['sm', 'lg']),
    className: string,
    classNames: object.isRequired,
    onChange: func,
  }

  static defaultProps = {
    onLabel: 'On',
    offLabel: 'Off',
    classNames: classes,
  }

  handleClick = () => {
    const { checked, onChange } = this.props
    onChange && onChange(!checked)
  }

  render () {
    const {
      onLabel, offLabel,
      classNames, className,
      size, checked,
    } = this.props
    const cls = [classNames.toggle, checked ? classNames.on : classNames.off]
    className && cls.push(className)
    size && cls.push(classNames[size])

    return <div className={cls.join(' ')} onClick={this.handleClick}>
      <i className={classNames.circle} />
      <span className={classNames.onLabel}>{onLabel}</span>
      <span className={classNames.offLabel}>{offLabel}</span>
    </div>
  }
}
