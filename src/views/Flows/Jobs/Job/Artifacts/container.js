import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map, List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { generatorJobId, actions } from 'redux/modules/job'

import { is } from 'util/nodeStatus'

import Artifacts from './artifacts'

import classes from './container.scss'

function mapStateToProps (state, props) {
  const { job } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)
  const j = job.getIn(['data', jobId], new Map())
  return {
    flowId,
    jobNumber,
    finished: is.finish(j.get('status')),
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

    finished: PropTypes.bool,
    artifacts: ImmutablePropTypes.list.isRequired,

    query: PropTypes.func.isRequired,
  }

  static defaultProps = {
    artifacts: new List()
  }

  componentDidMount () {
    const { finished, flowId, jobNumber, query } = this.props
    finished && query(flowId, jobNumber)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.finished && nextProps.finished) {
      const { flowId, jobNumber, query } = nextProps
      query(flowId, jobNumber)
    }
  }

  renderWaiting () {
    return <h4 className={classes.waitting}>
      正在构建中...
    </h4>
  }

  render () {
    const { finished, artifacts } = this.props
    return finished ? <Artifacts artifacts={artifacts} />
      : this.renderWaiting()
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  JobArtifactContainer
)
