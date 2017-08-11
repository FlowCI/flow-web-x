// to show build guide or redirect to jobs
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { STATUS } from 'redux-http'

import Loading from 'components/Loading'
import Guide from 'views/BuildGuide'

function mapStateToProps (state, props) {
  const { job } = state
  const { location } = props
  const status = job.getIn(['ui', 'QUERY'])
  return {
    hasJob: job.get('data').size > 0,
    loaded: status > STATUS.send,
    baseHref: location.pathname,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}

export class FlowIndexRoute extends Component {
  static propTypes = {
    hasJob: PropTypes.bool,
    loaded: PropTypes.bool,
    baseHref: PropTypes.string,
    redirect: PropTypes.func.isRequired,
  }

  state = {
    loaded: this.props.loaded
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.hasJob) {
      const { baseHref, redirect } = nextProps
      redirect(`${baseHref}/jobs`)
    } else if (!this.state.loaded && nextProps.loaded) {
      this.setState({ loaded: true })
    }
  }

  render () {
    const { loaded } = this.state
    if (loaded) {
      return <Guide />
    }
    return <div>
      <Loading />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowIndexRoute)
