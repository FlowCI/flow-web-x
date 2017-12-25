import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS, Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/step'
import { actions as pluginActions } from 'redux/modules/plugin'
import { push } from 'react-router-redux'

import Toggle from 'rc-components/Toggle'
import Input from 'rc-components/Input'
import Button from 'components/Buttonx'
import Loading from 'components/Loading'
import Editor from 'components/CodeEditor'

import ConfigPlugin from '../ConfigPlugin'

import classes from './step.scss'

const envsSelector = createSelector(
  (step) => step.get('envs'),
  (envs) => envs.toJS()
)
function mapStateToProps (state, props) {
  const { step: steps, plugin: plugins } = state
  const { params: { flowId, pluginId } } = props
  const name = decodeURIComponent(pluginId)

  const step = steps.getIn(['data', name])
  const pluginName = step ? step.get('plugin') : undefined

  return {
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

export class FlowStepConfig extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    step: ImmutablePropTypes.map,
    plugin: ImmutablePropTypes.map,
    pluginName: PropTypes.string,
    loading: PropTypes.bool,

    getPlugin: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  state = this.calcState()

  calcState (props = this.props) {
    const { step } = props
    if (!step) {
      return {
        code: '',
        allowFailure: ''
      }
    }
    return {
      code: step.get('script'),
      allowFailure: step.get('allowFailure'),
    }
  }

  componentDidMount () {
    const {
      loading, step, flowId,
      plugin, pluginName,
      getPlugin, redirect
    } = this.props
    if (!loading && !step) {
      redirect(`/flows/${flowId}/settings/editor`)
      return
    }
    pluginName && !plugin && getPlugin(pluginName)
  }

  componentWillReceiveProps (nextProps) {
    const { loading, step } = nextProps
    if (step && !this.props.step) {
      const { pluginName, plugin, getPlugin } = nextProps
      if (pluginName && !plugin) {
        getPlugin(pluginName)
      }
    }
    if (!loading && !step) {
      const { flowId, redirect } = nextProps
      redirect(`/flows/${flowId}/settings/editor`)
    } else if (step && step !== this.props.step) {
      this.setState(this.calcState(nextProps))
    }
  }

  toggleAllowFailure = (value) => {
    this.setState({ allowFailure: value }, this.save)
  }

  handleEditorChange = (value) => {
    this.setState({ code: value })
  }

  save = () => {
    const { save, flowId, step } = this.props
    const { code: script, allowFailure } = this.state
    return save(flowId, step.merge(fromJS({ script, allowFailure })))
  }

  cancel = () => {
    this.setState(this.calcState())
  }

  saveEnvs = (plugin, envs) => {
    const { save, flowId, step } = this.props
    const nextStep = step.set('envs', new Map(envs))
    return save(flowId, nextStep)
  }

  cancelEnvsEdit = (plugin, envs) => {

  }

  remove = () => {
    const { remove, step, flowId, redirect } = this.props
    return remove(flowId, step.get('name')).then(() => {
      redirect(`/flows/${flowId}/settings/editor`)
    })
  }

  renderLoading () {
    return <div className={classes.loading}>
      <Loading />
    </div>
  }

  renderStepHeader () {
    const { step, plugin } = this.props
    const { allowFailure } = this.state
    return <div className={classes.header}>
      <div className={classes.info}>
        <h5>
          <Input value={step.get('name')} readOnly />
          {plugin && <small>
            <a href={plugin.get('source')} target='_blank'>使用帮助</a>
          </small>}
        </h5>
        {plugin && <h6>{plugin.get('description')}</h6>}
      </div>
      <div className={classes.actions}>
        <div className={classes.toggle}>
          允许失败 <Toggle checked={allowFailure}
            onChange={this.toggleAllowFailure} />
        </div>
        <Button type='danger' plain size='sm' onClick={this.remove}>
          删除插件
        </Button>
      </div>
    </div>
  }

  renderScript () {
    const { code } = this.state
    return <Editor value={code} language='powershell'
      onChange={this.handleEditorChange} />
  }

  renderStepFooter () {
    return <div className={classes.footer}>
      <Button type='primary' onClick={this.save}>保存</Button>
      <Button type='text' onClick={this.cancel}>取消</Button>
    </div>
  }

  renderPlugin () {
    const { plugin, step } = this.props
    const envs = envsSelector(step)
    return <ConfigPlugin plugin={plugin} envs={envs}
      save={this.saveEnvs}
      cancel={this.cancelEnvsEdit} />
  }

  renderContent () {
    const { plugin } = this.props
    return <div className={classes.step}>
      {this.renderStepHeader()}
      {plugin ? this.renderPlugin() : this.renderScript()}
      {!plugin && this.renderStepFooter()}
    </div>
  }

  render () {
    const { step, pluginName, plugin } = this.props
    const isLoading = !step || (pluginName && !plugin)
    return isLoading ? this.renderLoading() : this.renderContent()
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['getPlugin'] })(FlowStepConfig)
)
