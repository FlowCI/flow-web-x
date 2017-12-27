import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/step'

import Button from 'components/Buttonx'

import Plugins from './plugins'
import { Step } from '../Step'

import classes from './container.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  const { step } = state
  return {
    flowId,
    selected: step.getIn(['ui', 'abstractStep']),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    install: actions.addStep,
    select: actions.setAbstractStep,
    reset: actions.freedAbstractStep,
    redirect: push,
  }, dispatch)
}

const customStep = new Map({
  name: '自定义脚本',
  description: '编辑自定义脚本，通过脚本实现更多功能',
  allowFailure: false,
  script: '',
})

export class FlowPluginContainer extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    selected: ImmutablePropTypes.map,

    /**
     * @param {function} function (flowId, plugin) {}
     */
    select: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,

    install: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  componentWillUnmount () {
    const { reset } = this.props
    reset()
  }

  handleSelect = (flowId, plugin) => {
    const { select } = this.props
    const step = plugin.set('plugin', plugin.get('name'))
    select(flowId, step)
  }

  useCustomScript = () => {
    const { select, flowId } = this.props
    select(flowId, customStep)
  }

  handleStepChange = (flowId, step, { click }) => {
    const { select, install } = this.props
    if (!click) {
      return select(flowId, step)
    }
    return install(flowId, step).then((resp) => {
      const { data } = resp
      const last = data[data.length - 1]
      const stepName = encodeURIComponent(last.name)
      const { redirect, flowId } = this.props
      redirect(`/flows/${flowId}/settings/editor/step/${stepName}`)
    })
  }

  cancel = () => {
    const { redirect, flowId } = this.props
    redirect(`/flows/${flowId}/settings/editor`)
  }

  renderAddText () {
    return <span>此步骤可添加以下插件或使用 <a onClick={this.useCustomScript}>
      自定义脚本</a>
    </span>
  }

  renderSelectedText () {
    return '配置插件'
  }

  renderHeader () {
    const { selected } = this.props
    return <div className={classes.header}>
      <span className={classes.headerText}>
        <i className='icon icon-jigsaw' />
        {selected ? this.renderSelectedText() : this.renderAddText()}
      </span>
      <Button type='danger' plain onClick={this.cancel}>
        取消添加
      </Button>
    </div>
  }

  renderContainer (children) {
    return <div className={classes.container}>
      {this.renderHeader()}
      {children}
    </div>
  }

  renderList () {
    const { flowId } = this.props
    return <Plugins flowId={flowId} onSelect={this.handleSelect} />
  }

  render () {
    const { flowId, selected, reset } = this.props
    let content
    if (!selected) {
      content = this.renderList()
    } else {
      const userScript = !selected.get('plugin')
      const plugin = userScript ? undefined : selected

      content = <Step flowId={flowId}
        className={classes.step}
        step={selected} plugin={plugin}
        resetable={false}
        save={this.handleStepChange}
        remove={reset}
      />
    }
    return this.renderContainer(content)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowPluginContainer)
