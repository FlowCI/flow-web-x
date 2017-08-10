import { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'
import { actions as jobActions } from 'redux/modules/job'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.get,
    queryJobs: jobActions.query,
  }, dispatch)
}

export class FlowView extends Component {
  static propTypes = {
    params: PropTypes.shape({
      flowId: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,

    get: PropTypes.func.isRequired,
    queryJobs: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { get, queryJobs, params: { flowId } } = this.props
    get(flowId)
    queryJobs(flowId)
  }

  render () {
    const { children } = this.props
    return children
  }
}

export default connect(undefined, mapDispatchToProps)(FlowView)
