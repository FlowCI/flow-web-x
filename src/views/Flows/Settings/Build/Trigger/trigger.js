import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/flow'

import Header from '../../components/Header'
import RadioPanel from '../components/RadioPanel'
import Panel from '../components/Panel'

const triggerSelector = createSelector(
  (flow) => flow,
  (flow) => {
    return {
      prEnable: flow.get('prEnable'),
      pushEnable: flow.get('pushEnable'),
      tagEnable: flow.get('tagEnable'),
      tagFilter: flow.get('tagFilter') || [],
      branchFilter: flow.get('branchFilter') || [],
    }
  }
)
function mapStateToProps (state, props) {
  const { flowId } = props
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  return {
    trigger: triggerSelector(f)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    update: actions.setTrigger,
  }, dispatch)
}

export class FlowTriggerSetting extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    trigger: PropTypes.shape({
      prEnable: PropTypes.bool.isRequired,
      pushEnable: PropTypes.bool.isRequired,
      tagEnable: PropTypes.bool.isRequired,
      tagFilter: ImmutablePropTypes.list.isRequired,
      branchFilter: ImmutablePropTypes.list.isRequired,
    }).isRequired,
    update: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  constructor (props, context) {
    super(props, context)
    this.state = this.getState()
  }

  getState (props = this.props) {
    const {
      trigger: {
        prEnable,
        pushEnable,
        tagEnable,
        tagFilter,
        branchFilter,
      }
    } = props
    return {
      pushEnable,
      tagEnable,
      tagFilter: tagFilter.join('\n'),
      prEnable,
      branchFilter: branchFilter.join('\n'),
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.trigger !== nextProps.trigger) {
      this.setState(this.getState(nextProps))
    }
  }

  getStateValue () {
    return {
      pushEnable: this.state.pushEnable,
      tagEnable: this.state.tagEnable,
      tagFilter: this.state.tagFilter.split('\n'),
      prEnable: this.state.prEnable,
      branchFilter: this.state.branchFilter.split('\n'),
    }
  }

  handlePushToggle = (c) => {
    this.saveValue({ pushEnable: c })
  }

  handleTagToggle = (c) => {
    this.saveValue({ tagEnable: c })
  }

  handlePrToggle = (c) => {
    this.saveValue({ prEnable: c })
  }

  handleSaveBranch = (s) => {
    this.saveValue({ branchFilter: s })
  }

  handleSaveTag = (s) => {
    this.saveValue({ tagFilter: s })
  }

  saveValue (obj) {
    this.setState(obj, () => {
      const values = this.getStateValue()
      const { update, flowId } = this.props
      update(flowId, values)
    })
  }

  render () {
    const { i18n } = this.props
    const {
      pushEnable, tagEnable, prEnable,
      branchFilter, tagFilter,
    } = this.state
    return <section>
      <Header title={i18n('触发器')}
        subTitle={i18n('当代码仓库收到提交请求时，flow.ci将自动触发构建   查看帮助文档')}
      />
      <RadioPanel title='Git Push'
        enabled={pushEnable}
        onToggle={this.handlePushToggle}
        filter={branchFilter}
        onSave={this.handleSaveBranch}
        defaultFilter={['master', 'develop', 'feature*'].join('\n')} />
      <RadioPanel title='Git Tag'
        enabled={tagEnable}
        onToggle={this.handleTagToggle}
        filter={tagFilter}
        onSave={this.handleSaveTag} />
      <Panel enabled={prEnable} title='Push Request'
        onToggle={this.handlePrToggle} />
    </section>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowTriggerSetting)
