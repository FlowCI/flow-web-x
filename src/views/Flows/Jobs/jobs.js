import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions as flowActions } from 'redux/modules/flow'
import { actions as jobActions } from 'redux/modules/job'

import Loading from 'components/Loading'
import Button from 'components/Button'

import { JobStatusSubscriber } from '../Socket'

import Filter from './components/Filter'
import JobItem from './components/JobItem'

import classes from './jobs.scss'

function mapStateToProps (state, props) {
  const { job, flow } = state
  const id = props.params.flowId

  const status = job.getIn(['ui', 'QUERY'])
  return {
    key: id,
    flowId: id,
    flowName: flow.getIn(['data', id, 'name']),

    jobIds: job.get('list'),

    filter: job.getIn(['ui', 'filter']),
    loading: status !== STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: flowActions.query,
    createJob: jobActions.create,
    redirect: push
  }, dispatch)
}

export class JobsView extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    flowName: PropTypes.string,
    jobIds: ImmutablePropTypes.iterable.isRequired,

    filter: PropTypes.shape({
      branch: PropTypes.string,
      onlySelf: PropTypes.bool,
      pullRequest: PropTypes.bool,
    }).isRequired,

    loading: PropTypes.bool,

    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,

    children: PropTypes.node,

    i18n: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    createJob: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filter: {},
    i18n: createI18n(language),
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.queryWithFilter(nextProps)
    }
  }

  queryWithFilter (props = this.props, preJob) {
    const { filter, query, flowId } = props
    query(flowId, filter, preJob)
  }

  handleMore = (e) => {
    this.queryWithFilter(this.props)
  }

  handleClick = (job) => {
    const { redirect, location, params } = this.props
    redirect({
      ...location,
      pathname: `/flows/${params.flowId}/jobs/${job.get('number')}`
    })
  }

  handleCreateJob = () => {
    const { createJob, flowId } = this.props
    return createJob(flowId)
  }

  renderFlowHeader () {
    const { flowName } = this.props
    return <div className={classes.flow}>
      <div className={classes.brand}>
        <i className='icon icon-layergroup' />{flowName}
      </div>
      <Button to='settings'
        className='btn btn-inverse'
        leftIcon={<i className='icon icon-settings' />}>
        工作流设置
      </Button>
    </div>
  }

  renderJobs () {
    const { jobIds, i18n } = this.props
    if (jobIds.size) {
      return <div className={classes.jobs}>
        <hr />
        {jobIds.map((id) => <JobItem jobId={id} key={id}
          i18n={i18n} onClick={this.handleClick} />)}
      </div>
    }
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  renderContent () {
    const { i18n, flowId, loading } = this.props
    return <div className={classes.container}>
      {this.renderFlowHeader()}
      <div className={classes.actions}>
        <Button className='btn-primary' onClick={this.handleCreateJob}>
          {i18n('运行工作流')}
        </Button>
        <Filter flowId={flowId} i18n={i18n} />
      </div>
      {this.renderJobs()}
      {loading && this.renderLoading()}
    </div>
  }

  render () {
    const { children, flowId } = this.props
    return <JobStatusSubscriber flowId={flowId}>
      {children || this.renderContent()}
    </JobStatusSubscriber>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'], trigger: 'unique' })(JobsView)
)
