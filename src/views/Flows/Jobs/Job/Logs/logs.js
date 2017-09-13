import React, { Component } from 'react'
import { string } from 'prop-types'
import { iterable } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { generatorJobId } from 'redux/modules/job'

import JobNode from '../components/JobNode'

import classes from './logs.scss'
function mapStateToProps (state, props) {
  const { node } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)
  return {
    jobId,
    flowId,
    jobNumber,
    nodeIds: node.getIn([jobId, 'list']),
  }
}
export class JobLogsView extends Component {
  static propTypes = {
    downloadHref: string,
    jobId: string.isRequired,
    nodeIds: iterable.isRequired,
  }

  render () {
    const { jobId, downloadHref, nodeIds } = this.props
    return <div>
      <h4 className={classes.header}>
        构建日志
        {!!downloadHref && <a href={downloadHref} download>download</a>}
      </h4>
      {nodeIds.map((id) => <JobNode key={id} jobId={jobId} nodeId={id} />)}
    </div>
  }
}
export default connect(mapStateToProps)(JobLogsView)
