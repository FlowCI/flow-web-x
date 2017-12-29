import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './labels.scss'

export default class FlowPluginLabels extends Component {
  static propTypes = {
    value: PropTypes.any,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  handleActive = (value) => {
    const { onChange } = this.props
    onChange(value)
  }

  cloneChild = (child) => {
    const { value } = this.props
    return React.cloneElement(child, {
      active: value === child.props.value,
      onActive: this.handleActive,
    })
  }

  render () {
    const { children } = this.props
    return <ui className={classes.labels}>
      {React.Children.map(children, this.cloneChild)}
    </ui>
  }
}
