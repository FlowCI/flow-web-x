import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'

// function mapStateToProps (state, props) {
//   const { flow } = state
//   const { params: { flowId } } = props
//   const status = flow.getIn(['ui', 'get', flowId ])
//   return {
//     loaded: status === STATUS.success,
//     loading: status === STATUS.send,
//   }
// }

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.get,
  }, dispatch)
}

export class JobsView extends Component {
  static propTypes = {
    get: PropTypes.func.isRequired,
    params: PropTypes.shape({
      flowId: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
  }

  componentDidMount () {
    // const { get, params: { flowId } } = this.props
    // get(flowId)
  }

  render () {
    return <div>hello world</div>
  }
}

export default connect(undefined, mapDispatchToProps)(JobsView)
