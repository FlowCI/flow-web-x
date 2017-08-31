import React, { Component } from 'react'
import { node, any, func } from 'prop-types'

import classes from './bars.scss'

export default class TabBars extends Component {
  static propTypes = {
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
    const { children } = this.props
    return <ul className={classes.bars}>
      {React.Children.map(children, this.cloneChild)}
    </ul>
  }
}
