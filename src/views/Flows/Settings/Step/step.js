import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import Header from './Header'
import Envs from './Envs'
import Script from './Script'

import classes from './step.scss'

export default class FlowStep extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    plugin: ImmutablePropTypes.map,

    step: ImmutablePropTypes.contains({
      allowFailure: PropTypes.bool,
      envs: ImmutablePropTypes.map,
    }).isRequired,

    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    step: this.props.step
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.step !== nextProps.step) {
      this.setState({ step: nextProps.step })
    }
  }

  handleSaveScript = (script) => {

  }

  handleSaveEnvs = (envs) => {

  }

  handleSaveStep = (changedStep) => {
    const { flowId, save } = this.props
    const { step } = this.state
    const nextStep = step.merge(new Map(changedStep))
    this.setState({ step: nextStep })
    return save(flowId, nextStep)
  }

  handleRemove = () => {
    const { flowId, step, remove } = this.props
    return remove(flowId, step.get('name'))
  }

  renderEnvs () {
    const { plugin } = this.props
    const { step } = this.state

    const properties = plugin.getIn(['detail', 'properties'])
    const envs = step.get('envs', new Map())
    return <Envs properties={properties} values={envs}
      save={this.handleSaveEnvs} />
  }

  renderScript () {
    const { step } = this.state
    return <Script script={step.get('script')} save={this.handleSaveScript} />
  }

  render () {
    const { plugin } = this.props
    const { step } = this.state
    const allowFailure = step.get('allowFailure')

    return <div className={classes.panel}>
      <Header name={step.get('name')} plugin={plugin}
        allowFailure={allowFailure}
        save={this.handleSaveStep}
        remove={this.handleRemove} />
      {plugin ? this.renderEnvs() : this.renderScript()}
    </div>
  }
}
