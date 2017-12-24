import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './tabs.scss'
import classnames from 'classnames'

export default class AddPluginsTabs extends Component {
  static propTypes = {
    value: PropTypes.any,
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  cloneChild = (child) => {
    const { value, onChange } = this.props
    return React.cloneElement(child, {
      onActive: onChange,
      active: value === child.props.value
    })
  }

  render () {
    const { className, children } = this.props
    return <ul className={classnames(classes.tabs, className)}>
      {React.Children.map(children, this.cloneChild)}
    </ul>
  }
}
