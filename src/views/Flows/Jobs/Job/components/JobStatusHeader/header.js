import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { is } from 'util/nodeStatus'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/job'

import JobIcon from 'components/Icon/JobText'
import Button from 'components/Button'
import classes from './header.scss'

function mapStateToProps (state, { jobId }) {
  const { job } = state
  return {
    job: job.getIn(['data', jobId])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    stop: actions.stop,
  }, dispatch)
}

export class JobStatusHeader extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    job: ImmutablePropTypes.map.isRequired,
    stop: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired
  }

  handleStop = () => {
    const { stop, flowId, job } = this.props
    return stop(flowId, job.get('number'))
  }

  renderActions () {
    const { job } = this.props
    const canStop = is.finish.not(job.get('status'))
    if (canStop) {
      return <div className={classes.actions}>
        <Button className='btn-inverse' onClick={this.handleStop}>
          停止构建
        </Button>
      </div>
    }
  }

  render () {
    const { job, i18n } = this.props
    const status = job.get('status')
    const category = job.get('category')

    const startedAt = job.getIn(['result', 'startTime'])
    const duration = job.getIn(['result', 'duration'])

    return <div className={`${classes.header} ${job.get('status', '')}`}>
      <JobIcon status={status} />
      <ul className={classes.list}>
        <li>{i18n('CATEGORY')[category]}</li>
        {startedAt && <li>{i18n('buildFromNow', { time: startedAt })}</li>}
        {!!duration && <li>
          {i18n('buildDuration', { duration })}
        </li>}
      </ul>
      {this.renderActions()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobStatusHeader)
