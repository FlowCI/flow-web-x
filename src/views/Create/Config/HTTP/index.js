import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'

import Form from './form'
function mapStateToProps (state, { flowId }) {
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  return {
    webhook: f.getIn(['envs', 'FLOW_GIT_WEBHOOK']),
    defaultGitUrl: f.getIn(['envs', 'FLOW_GIT_URL'], ''),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    done: actions.doneCreate,
  }, dispatch)
}

export class HTTPConfig extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    webhook: PropTypes.string.isRequired,
    defaultGitUrl: PropTypes.string,
    git: PropTypes.string,

    done: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  getGitSource () {
    const { git } = this.props
    return git ? git.toUpperCase() : 'UNDEFINED_HTTP'
  }

  handleSubmit = (values) => {
    const { done, flowId } = this.props
    return done(flowId, values)
  }

  render () {
    const { defaultGitUrl } = this.props
    return <Form {...this.props} type='HTTP'
      source={this.getGitSource()}
      initialValues={{ url: defaultGitUrl }}
      onSubmit={this.handleSubmit} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HTTPConfig)
