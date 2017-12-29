import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { push } from 'react-router-redux'
import { actions } from 'redux/modules/step'
import { actions as pluginActions } from 'redux/modules/plugin'

import Loading from 'components/Loading'
import Step from './step'

import classes from './container.scss'

function mapStateToProps (state, props) {
  const { step: steps, plugin: plugins } = state
  const { params: { flowId, stepName } } = props
  const name = decodeURIComponent(stepName)

  const step = steps.getIn(['data', name])
  const pluginName = step ? step.get('plugin') : undefined

  return {
    key: name,
    base: `/flows/${flowId}/settings/editor`,
    step,
    flowId,
    pluginName,
    plugin: pluginName ? plugins.getIn(['data', pluginName]) : undefined,
    loading: steps.getIn(['ui', 'QUERY']) !== STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getPlugin: pluginActions.get,
    save: actions.updateStep,
    remove: actions.removeStep,
    redirect: push,
  }, dispatch)
}

export class FlowStepContainer extends Component {
  static propTypes = {
    base: PropTypes.string.isRequired,
    flowId: PropTypes.string.isRequired,
    step: ImmutablePropTypes.map,
    plugin: ImmutablePropTypes.map,
    pluginName: PropTypes.string,

    loading: PropTypes.bool,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    getPlugin: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  }

  componentDidMount () {
    const {
      loading, step,
      pluginName,
      getPlugin,
    } = this.props
    if (!loading && !step) {
      return this.redirectToDefault()
    }
    if (this.shouldFetchPlugin()) {
      getPlugin(pluginName)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { loading, step } = nextProps
    if (step && !this.props.step) {
      const { pluginName, getPlugin } = nextProps
      if (this.shouldFetchPlugin(nextProps)) {
        getPlugin(pluginName)
      }
    }
    if (!loading && !step) {
      this.redirectToDefault(nextProps)
    }
  }

  shouldFetchPlugin (props = this.props) {
    const { pluginName, plugin } = props
    return pluginName && !plugin
  }

  redirectToDefault (props = this.props) {
    const { base, redirect } = props
    redirect(base)
  }

  redirectToStep (step) {
    const { base, redirect } = this.props
    const name = encodeURIComponent(step.get('name'))
    const isFinal = step.get('isFinal')
    redirect(`${base}/${isFinal ? 'afterStep' : 'step'}/${name}`)
  }

  handleSave = (flowId, nextStep) => {
    const { step, save } = this.props
    return save(flowId, nextStep).then(() => {
      if (step.get('name') !== nextStep.get('name')) {
        this.redirectToStep(nextStep)
      }
    })
  }

  shouldWaiting () {
    const { step, pluginName, plugin } = this.props
    return !step || (pluginName && !plugin)
  }

  renderLoading () {
    return <div className={classes.loading}>
      <Loading />
    </div>
  }

  render () {
    if (this.shouldWaiting()) {
      return this.renderLoading()
    }
    const { flowId, step, plugin, remove } = this.props
    return <Step flowId={flowId} step={step} plugin={plugin}
      save={this.handleSave} remove={remove} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['getPlugin'] })(FlowStepContainer)
)
