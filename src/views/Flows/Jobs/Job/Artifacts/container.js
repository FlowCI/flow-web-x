import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { generatorJobId, actions } from 'redux/modules/job'

import Artifacts from './artifacts'

function mapStateToProps (state, props) {
  const { job } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)
  return {
    flowId,
    jobNumber,
    artifacts: job.getIn(['artifacts', jobId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.queryArtifact,
  }, dispatch)
}

export class JobArtifactContainer extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    jobNumber: PropTypes.string.isRequired,

    artifacts: ImmutablePropTypes.list.isRequired,

    query: PropTypes.func.isRequired,
  }

  static defaultProps = {
    artifacts: new List()
  }

  componentDidMount () {
    const { flowId, jobNumber, query } = this.props
    query(flowId, jobNumber)
  }

  render () {
    const { artifacts } = this.props
    return <div>
      <Artifacts artifacts={artifacts} />
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  JobArtifactContainer
)
