import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import autoCancel from 'react-redux-http'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/flow'

import Loading from 'components/Loading'

import Guide from '../BuildGuide'

function mapStateToProps (state) {
  const { flow } = state
  const status = flow.getIn(['ui', 'query'])
  return {
    flowId: undefined, // flow.getIn(['data', 0, 'id']),
    loaded: status > STATUS.send,
    queryed: status >= STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    redirect: push,
  }, dispatch)
}

export class HomeWrapper extends Component {
  static propTypes = {
    flowId: PropTypes.string,
    loaded: PropTypes.bool,
    queryed: PropTypes.bool,

    query: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { flowId, queryed, query } = this.props
    !queryed && query()
    flowId && this.props.redirect(`/flows/${flowId}`)
  }

  componentWillReceiveProps (nextProps) {
    const { flowId, redirect } = nextProps
    flowId && redirect(`/flows/${flowId}`)
  }

  render () {
    const { loaded } = this.props
    if (!loaded) {
      return <div><Loading /></div>
    }
    return <Guide />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(HomeWrapper)
)
