import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import createI18n from '../i18n'
import language from 'util/language'

import { generatorJobId } from 'redux/modules/job'

import { Map } from 'immutable'

// import moment from 'moment'

import Loading from 'components/Loading'

import { Mapping, Legend, Entry } from './mapping'

import classes from './info.scss'

function mapStateToProps (state, props) {
  const { job } = state
  const { params: { flowId, jobNumber } } = props
  const jobId = generatorJobId(flowId, jobNumber)
  return {
    job: job.getIn(['data', jobId])
  }
}

export class JobInfo extends Component {
  static propTypes = {
    job: ImmutablePropTypes.map,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  getCommit (id) {
    return id ? id.substr(0, 7) : ''
  }

  renderCommit () {
    const { job, i18n } = this.props
    const envs = job.get('envs', new Map())
    const outputs = job.getIn(['result', 'outputs'], new Map())

    const commitBlock =
      <a target='_blank' href={outputs.get('FLOW_GIT_COMMIT_URL')}>
        {outputs.get('FLOW_GIT_COMMIT_ID', '-')}
      </a>
    const compareBlock =
      <a target='_blank' href={outputs.get('FLOW_GIT_COMPARE_URL')}>
        {outputs.get('FLOW_GIT_COMPARE_ID')}
      </a>

    return <Mapping>
      <Legend name={i18n('提交信息')} />
      <Entry name='Commit' value={commitBlock} />
      <Entry name='Author'
        value={outputs.get('FLOW_GIT_AUTHOR')} />

      <Entry name='Branch'
        value={outputs.get('FLOW_GIT_BRANCH')} />

      <Entry name='Commit message'
        value={outputs.get('FLOW_GIT_CHANGELOG')} />

      <Entry name='Compare' value={compareBlock} />
      <Legend name={i18n('Agent 信息')} />
      <Entry name='Agent'
        value={envs.get('FLOW_JOB_AGENT_INFO')} />
    </Mapping>
  }

  renderContent () {
    return this.renderCommit()
  }

  render () {
    const { job } = this.props
    return <div>
      {job ? this.renderContent() : <div className={classes.loading}>
        <Loading />
      </div>}
    </div>
  }
}

export default connect(mapStateToProps)(JobInfo)
