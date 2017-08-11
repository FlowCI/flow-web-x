import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'

import { push } from 'react-router-redux'

import Loading from 'components/Loading'

function mapStateToProps (state) {
  const { session } = state
  return {
    authored: session.has('user'),
    authoring: session.getIn(['ui', 'SIGNIN']) === STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}

export class NeedSession extends Component {
  static propTypes = {
    authored: PropTypes.bool,
    authoring: PropTypes.bool,
    children: PropTypes.node,

    redirect: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { authored, authoring } = this.props
    if (!authored && !authoring) {
      this.toSignIn()
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
      return <div>
        <p className='hide'>正在登录中,请稍后</p>
        <Loading />
      </div>
    }
    return <div />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NeedSession)
