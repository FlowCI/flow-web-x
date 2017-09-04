import React, { Component } from 'react'
import { string, node, any, func } from 'prop-types'

import classes from './bars.scss'

export default class TabBars extends Component {
  static propTypes = {
    className: string,
    children: node,
    value: any,
    onChange: func,
  }

  handleActive = (v) => {
    const { value, onChange } = this.props
    if (value !== v) {
      return onChange && onChange(v)
    }
  }

  cloneChild = (child, index) => {
    const { value } = this.props
    return React.cloneElement(child, {
      active: child.props.value === value,
      onActive: this.handleActive,
    })
  }

  render () {
    const { className, children } = this.props
    const cls = [classes.bars]
    className && cls.push(className)
    return <ul className={cls.join(' ')}>
      {React.Children.map(children, this.cloneChild)}
    </ul>
  }
}
