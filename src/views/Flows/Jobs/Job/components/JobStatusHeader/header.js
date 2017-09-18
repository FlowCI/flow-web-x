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
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { job, i18n } = this.props
    const status = job.get('status')
    return <div className={`${classes.header} ${job.get('status', '')}`}>
      <JobIcon status={status} />
      <ul className={classes.list}>
        <li>{i18n('构建于4小时前', { time: job.get('startedAt') })}</li>
        <li>
          {i18n('花费43秒', { duration: job.get('duration') })}
        </li>
        <li>{i18n('手动构建')}</li>
      </ul>
    </div>
  }
}

export default connect(mapStateToProps)(JobStatusHeader)
