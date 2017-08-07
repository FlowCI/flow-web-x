import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './select.scss'

export default class Option extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,

    /*
      contain: .option, .selected, .disabled
    */
    classNames: PropTypes.object.isRequired,

    selected: PropTypes.bool,
    disabled: PropTypes.bool,

    onSelect: PropTypes.func
  }

  static defaultProps = {
    classNames: classes
  }

  handleClick = (e) => {
    const { onSelect, value } = this.props
    onSelect && onSelect(value)
  }

  render () {
    const {
      classNames, title, children,
      selected, disabled,
    } = this.props

    const cls = [classNames.option]
    selected && cls.push(classNames.selected)
    disabled && cls.push(classNames.disabled)

    return <li className={cls.join(' ')}
      onClick={!disabled && this.handleClick}>
      {title || children}
    </li>
  }
}
