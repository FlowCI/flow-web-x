import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import Header from './Header'
import Envs from './Envs'
import Script from './Script'

import classes from './step.scss'
import classnames from 'classnames'

export default class FlowStep extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    plugin: ImmutablePropTypes.map,

    step: ImmutablePropTypes.contains({
      allowFailure: PropTypes.bool,
      envs: ImmutablePropTypes.map,
    }).isRequired,

    resetable: PropTypes.bool,
    className: PropTypes.string,
    /**
     * @param {function} function (flowId, nextStep, options) {}
     * @param options.click {bool} 表明是否是点击保存按钮
     */
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    resetable: true
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
    this.handleSaveStep({ script }, { click: true })
  }

  handleSaveEnvs = (envs) => {
    this.handleSaveStep({ envs }, { click: true })
  }

  handleSaveStep = (changedStep, options) => {
    const { flowId, save } = this.props
    const { step } = this.state
    const nextStep = step.merge(new Map(changedStep))
    this.setState({ step: nextStep })
    return save(flowId, nextStep, options || {})
  }

  handleRemove = () => {
    const { flowId, step, remove } = this.props
    return remove(flowId, step.get('name'))
  }

  renderEnvs () {
    const { plugin, resetable } = this.props
    const { step } = this.state

    const properties = plugin.getIn(['detail', 'properties'])
    const envs = step.get('envs', new Map())
    return <Envs resetable={resetable}
      properties={properties} values={envs}
      save={this.handleSaveEnvs} />
  }

  renderScript () {
    const { resetable } = this.props
    const { step } = this.state
    return <Script resetable={resetable} script={step.get('script')}
      save={this.handleSaveScript} />
  }

  render () {
    const { plugin, className } = this.props
    const { step } = this.state
    const allowFailure = step.get('allowFailure')

    return <div className={classnames(classes.panel, className)}>
      <Header name={step.get('name')} plugin={plugin}
        allowFailure={allowFailure}
        save={this.handleSaveStep}
        remove={this.handleRemove} />
      {plugin ? this.renderEnvs() : this.renderScript()}
    </div>
  }
}
