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

import { actions as jobActions } from 'redux/modules/job'

import Loading from 'components/Loading'
import Button from 'components/Button'

import { JobStatusSubscriber } from '../Socket'

import Filter from './components/Filter'
import JobItem from './components/JobItem'
import BranchDialog from './components/BranchDialog'

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
    query: jobActions.query,
    createJob: jobActions.create,
    freedFilter: jobActions.freedFilter,
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
    freedFilter: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filter: {},
    i18n: createI18n(language),
  }

  state = {
    openBranchDialog: false
  }

  componentDidMount () {
    this.isMount = true
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.queryWithFilter(nextProps)
    }
  }

  componentWillUnmount () {
    this.isMount = false
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

  handleCreateJob = (branch) => {
    const { createJob, flowId, freedFilter } = this.props
    /**
     * 创建新的 job 时清空过滤条件,
     * @see https://trello.com/c/Y7r1Xfm0/1167-%E6%89%8B%E5%8A%A8%E6%9E%84%E5%BB%BA%E9%80%89%E5%88%86%E6%94%AF
     */
    freedFilter()
    return createJob(flowId, branch)
      .then(this.closeBranchDialog, this.closeBranchDialog)
  }

  openBranchDialog = () => {
    this.setState({ openBranchDialog: true })
  }

  closeBranchDialog = () => {
    if (this.isMount) {
      this.setState({ openBranchDialog: false })
    }
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
    const { openBranchDialog } = this.state
    return <div className={classes.container}>
      {this.renderFlowHeader()}
      <div className={classes.actions}>
        <Button className='btn-primary' onClick={this.openBranchDialog}>
          {i18n('运行工作流')}
        </Button>
        <Filter flowId={flowId} i18n={i18n} />
      </div>
      {this.renderJobs()}
      {loading && this.renderLoading()}
      <BranchDialog flowId={flowId} isOpen={openBranchDialog}
        onRequestClose={this.closeBranchDialog}
        onBuild={this.handleCreateJob}
      />
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
