import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EnumSteps from './steps'

import { connect } from 'react-redux'

import Stepper, { Step } from './components/Stepper'

import classes from './container.scss'

function mapStateToProps (state, props) {
  const { routes } = props
  const last = routes[routes.length - 1]
  return {
    activeStep: last.step,
  }
}

export class CreateFlowContainer extends Component {
  static propTypes = {
    params: PropTypes.object,

    activeStep: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      component: PropTypes.any,
    })).isRequired,
  }

  static defaultProps = {
    activeStep: 0,
    steps: EnumSteps,
  }

  render () {
    const { activeStep, steps, params } = this.props
    return <Stepper activeStep={activeStep} className={classes.container}>
      {steps.map((step, i) => <Step key={i} step={step} params={params} />)}
    </Stepper>
  }
}

export default connect(mapStateToProps)(CreateFlowContainer)
