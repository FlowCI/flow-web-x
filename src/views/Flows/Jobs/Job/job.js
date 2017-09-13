import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions, generatorJobId } from 'redux/modules/job'
import { actions as uiActions } from 'redux/modules/ui'

import Loading from 'components/Loading'

import JobNavbar from './components/JobNavbar'
import JobStatusHeader from './components/JobStatusHeader'

import classes from './job.scss'

function mapStateToProps (state, props) {
  const { job } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)
  const status = job.getIn(['ui', jobId, 'GET'])
  return {
    key: jobId,
    flowId,
    jobId,
    jobNumber,
    // isNotFound: false,
    loaded: status === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.get,
    freedResource: actions.freedResource,
    setBackUrl: uiActions.setBackUrl,
    freedBackUrl: uiActions.freedBackUrl
  }, dispatch)
}

export class JobContainer extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    jobId: PropTypes.string.isRequired,
    jobNumber: PropTypes.string.isRequired,
    // isNotFound: PropTypes.bool,
    loaded: PropTypes.bool,

    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    get: PropTypes.func.isRequired,
    freedResource: PropTypes.func.isRequired,
    setBackUrl: PropTypes.func.isRequired,
    freedBackUrl: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  componentDidMount () {
    const {
      get, flowId, jobNumber,
      setBackUrl, location,
    } = this.props
    get(flowId, jobNumber)
    const { query: { from } } = location
    if (from && /^\/\w+/.test(from)) {
      // 存在并且是相对路径
      setBackUrl(from)
    } else {
      const l = { ...location, pathname: `/flows/${flowId}/jobs` }
      l.query.from = undefined // remove from params
      setBackUrl(l)
    }
  }

  componentWillUnmount () {
    const { freedBackUrl, freedResource, jobId } = this.props
    freedBackUrl()
    freedResource(jobId)
  }

  renderLoading () {
    return <div className={classes.loading}>
      <Loading />
    </div>
  }

  renderContent () {
    const {
      jobNumber, i18n, location,
      jobId, flowId,
      children
    } = this.props
    const base = { ...location, pathname: `/flows/${flowId}/jobs/${jobNumber}` }
    return <div className={classes.content}>
      <JobNavbar jobId={jobId} i18n={i18n} base={base} />
      {children}
    </div>
  }

  render () {
    const { loaded, jobId, i18n } = this.props
    return <div className={classes.container}>
      {loaded && <JobStatusHeader jobId={jobId} i18n={i18n} />}
      {loaded ? this.renderContent() : this.renderLoading()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['get'] })(JobContainer)
)
