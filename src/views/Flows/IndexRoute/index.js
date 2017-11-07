// to show build guide or redirect to jobs
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'

function mapStateToProps (state, props) {
  const { flow } = state
  const { params: { flowId } } = props
  return {
    flowId,
    flow: flow.getIn(['data', flowId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: replace,
  }, dispatch)
}

export class FlowIndexRoute extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    flow: ImmutablePropTypes.map.isRequired, // eslint-disable-line react/no-unused-prop-types
    redirect: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  }

  componentDidMount () {
    this.tryRedirect()
  }

  componentWillUpdate (nextProps, nextState) {
    this.tryRedirect(nextProps)
  }

  tryRedirect (props = this.props) {
    const { flow, flowId, redirect } = props
    if (!flow) {
      return
    }
    const status = flow.getIn(['envs', 'FLOW_STATUS'])

    if (status === 'READY') {
      redirect(`/flows/${flowId}/jobs`)
    } else {
      redirect(`/create/${flowId}`)
    }
  }

  render () {
    return <div />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowIndexRoute)
