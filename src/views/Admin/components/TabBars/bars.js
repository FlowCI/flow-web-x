import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Ul } from 'components/InlineUl'

import classnames from 'classnames'
import classes from './bars.scss'

export default class TabBars extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.any,
    onChange: PropTypes.func,
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
    return <Ul className={classnames(classes.bars, className)}>
      {React.Children.map(children, this.cloneChild)}
    </Ul>
  }
}
