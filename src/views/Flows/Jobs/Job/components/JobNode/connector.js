import { connect } from 'react-redux'

import { STATUS } from 'redux-http'

function mapStateToProps (state, props) {
  const { node } = state
  const { jobId, nodeId } = props
  const nodeState = node.get(jobId)
  return {
    node: nodeState.getIn(['data', nodeId]),
    log: nodeState.getIn(['log', nodeId]),
    fetching: nodeState.getIn(['ui', 'GET_LOG']) !== STATUS.success,
  }
}

export default function (component) {
  return connect(mapStateToProps)(component)
}
