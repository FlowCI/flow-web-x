import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import { connect } from 'react-redux'

import moment from 'moment'

import JobIcon from 'components/Icon/JobText'

import classes from './jobItem.scss'

function mapStateToProps (state, { jobId }) {
  const { job } = state

  return {
    job: job.getIn(['data', jobId])
  }
}

export class JobItem extends Component {
  static propTypes = {
    job: ImmutablePropTypes.map.isRequired,

    onClick: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  handleClick = () => {
    const { onClick, job } = this.props
    onClick(job)
  }

  renderItem (name, value) {
    return <div className={classes.item}>
      <span className={classes.name}>{name}</span>
      <span className={classes.value}>{value}</span>
    </div>
  }

  render () {
    const { job, i18n } = this.props
    const envs = job.get('envs', new Map())
    const startedAt = job.getIn(['result', 'startTime'])
    const status = job.get('status')
    return <div className={classes.job} onClick={this.handleClick}>
      <JobIcon status={status} colored />
      <div className={classes.info}>
        <h4>
          #{job.get('number')}&nbsp;&nbsp;
          {envs.get('FLOW_GIT_BRANCH')}
        </h4>
        <small>
          {envs.get('FLOW_GIT_CHANGELOG')}
        </small>
      </div>
      <div className={classes.detail}>
        <div className={`${classes.itemCol} ${classes.firstCol}`}>
          {this.renderItem(i18n('Commit'),
            envs.get('FLOW_GIT_COMMIT_ID', '-'))}
          {this.renderItem(i18n('Duration'), job.getIn(['result', 'duration'], ''))}
        </div>
        <div className={classes.itemCol}>
          {this.renderItem(i18n('Compare'),
            envs.get('FLOW_GIT_COMPARE_ID', '-'))}
          {this.renderItem(i18n('Built'),
            startedAt ? moment(startedAt * 1000).fromNow() : '-')}
        </div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps)(JobItem)
