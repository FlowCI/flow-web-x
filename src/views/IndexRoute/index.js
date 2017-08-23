import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import Loading from 'components/Loading'

import Guide from '../BuildGuide'

function mapStateToProps (state) {
  const { flow } = state
  const status = flow.getIn(['ui', 'QUERY'])
  return {
    flowId: undefined, // flow.get('data').first(),
    loaded: status > STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}

export class HomeWrapper extends Component {
  static propTypes = {
    flowId: PropTypes.string,
    loaded: PropTypes.bool,

    redirect: PropTypes.func.isRequired,
  }

  state = {
    // tofix: 每次触发 flow query 时, Guide 都将重新 didMount
    loaded: this.props.loaded,
  }

  componentDidMount () {
    const { flowId } = this.props
    if (flowId) {
      this.props.redirect(`/flows/${flowId}`)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { flowId, redirect, loaded } = nextProps
    if (flowId) {
      redirect(`/flows/${flowId}`)
    } else if (!this.state.loaded && loaded) {
      this.setState({ loaded: true })
    }
  }

  render () {
    const { loaded } = this.state
    if (!loaded) {
      return <div><Loading /></div>
    }
    return <Guide />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(HomeWrapper)
)
