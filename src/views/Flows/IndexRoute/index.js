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
    flowId: PropTypes.string.isRequired,
    flow: ImmutablePropTypes.map.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { flow, flowId, redirect } = this.props
    const status = flow.getIn(['envs', 'FLOW_STATUS'])

    if (status === 'READY') {
      redirect(`/flows/${flowId}/jobs`)
    } else {
      redirect(`/create/${flowId}/config`)
    }
  }

  render () {
    return <div />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowIndexRoute)
