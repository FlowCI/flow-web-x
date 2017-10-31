import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RadioPanel from './components/RadioPanel'
import Panel from './components/Panel'

import classes from './trigger.scss'

function mapStateToProps (state, props) {
  const { flowId } = props
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  return {
    flow: f,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    update: function () {}
  }, dispatch)
}

export class FlowTriggerSetting extends Component {
  static propTypes = {
    // update: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    push: false,
    tag: false,
    pr: false
  }

  handlePushToggle = (c) => {
    this.setState({ push: c })
  }

  handleTagToggle = (c) => {
    this.setState({ tag: c })
  }

  handlePrToggle = (c) => {
    this.setState({ pr: c })
  }

  render () {
    const { i18n } = this.props
    const { push, tag, pr } = this.state
    return <section>
      <div className={classes.panel}>
        <h4>
          {i18n('触发器')}
        </h4>
        <small>
          {i18n('当代码仓库收到提交请求时，flow.ci将自动触发构建   查看帮助文档')}
        </small>
      </div>
      <RadioPanel title='Git Push' enabled={push}
        onToggle={this.handlePushToggle} />
      <RadioPanel title='Git Tag' enabled={tag}
        onToggle={this.handleTagToggle} />
      <Panel enabled={pr} title='Push Request'
        onToggle={this.handlePrToggle} />
    </section>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowTriggerSetting)
