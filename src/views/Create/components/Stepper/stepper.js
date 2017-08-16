import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Stepper extends Component {
  static propTypes = {
    activeStep: PropTypes.number.isRequired,
    children: PropTypes.node,
  }

  cloneChild = (child, index) => {
    const { activeStep } = this.props
    return React.cloneElement(child, {
      active: activeStep === index,
    })
  }

  render () {
    const { children } = this.props
    return <div>
      {React.Children.map(children, this.cloneChild)}
    </div>
  }
}
