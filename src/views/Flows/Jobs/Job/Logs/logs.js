import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { iterable } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { generatorJobId } from 'redux/modules/job'
import { actions } from 'redux/modules/node'

import { is } from 'util/nodeStatus'

import Button from 'components/Button'

import JobNode from '../components/JobNode'

import classes from './logs.scss'

function mapStateToProps (state, props) {
  const { node, job } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)

  return {
    jobId,
    flowId,
    jobNumber,
    nodeIds: node.getIn([jobId, 'list']),
    downloadHref: job.getIn(['data', jobId, 'envs', 'FLOW_JOB_LOG_PATH'])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getLog: actions.getLog,
  }, dispatch)
}

export class JobLogsView extends Component {
  static propTypes = {
    downloadHref: string,
    jobId: string.isRequired,
    flowId: string.isRequired,
    jobNumber: string.isRequired,
    nodeIds: iterable.isRequired,
    getLog: func.isRequired,
  }

  getLog = (node) => {
    const { getLog, flowId, jobNumber } = this.props
    if (is.finish(node.get('status'))) {
      getLog(flowId, jobNumber, node.get('id'))
    }
  }

  render () {
    const { jobId, downloadHref, nodeIds } = this.props
    return <div>
      <h4 className={classes.header}>
        <span>构建日志</span>
        {!!downloadHref && <Button href={downloadHref} download
          className={`btn-default ${classes.download}`}>
          下载完整日志
        </Button>}
      </h4>
      {nodeIds.map((id) => <JobNode key={id} jobId={jobId}
        nodeId={id} onExpended={this.getLog} getLog={this.getLog} />)}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobLogsView)
