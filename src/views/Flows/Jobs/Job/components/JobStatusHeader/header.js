import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import JobIcon from 'components/Icon/JobText'

import classes from './header.scss'

function mapStateToProps (state, { jobId }) {
  const { job } = state
  return {
    job: job.getIn(['data', jobId])
  }
}

export class JobStatusHeader extends Component {
  static propTypes = {
    job: ImmutablePropTypes.map.isRequired,
    i18n: PropTypes.func.isRequired
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
        {duration && <li>
          {i18n('buildDuration', { duration })}
        </li>}
      </ul>
    </div>
  }
}

export default connect(mapStateToProps)(JobStatusHeader)
