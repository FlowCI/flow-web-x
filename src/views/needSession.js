import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'
import { actions } from 'redux/modules/flow'

import Loading from 'components/Loading'

function mapStateToProps (state) {
  const { session } = state
  return {
    authored: !!session.get('user'),
    authoring: !!session.get('token'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
    queryFlows: actions.query
  }, dispatch)
}

export class NeedSession extends Component {
  static propTypes = {
    authored: PropTypes.bool,
    authoring: PropTypes.bool,
    children: PropTypes.node,

    redirect: PropTypes.func.isRequired,
    queryFlows: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { authored, queryFlows, authoring } = this.props
    if (!authored && !authoring) {
      this.toSignIn()
    } else {
      queryFlows()
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { authored, authoring } = nextProps
    if (!authored && !authoring) {
      this.toSignIn()
    }
  }

  toSignIn () {
    // todo 记下当前页面后跳转, 用于登录后跳回
    this.props.redirect('/signin')
  }

  render () {
    const { authored, authoring, children } = this.props
    if (authored) {
      return children
    } else if (authoring) {
      return <div className='text-center'>
        <p className='hide'>正在登录中,请稍后</p>
        <Loading />
      </div>
    }
    return <div />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NeedSession)
