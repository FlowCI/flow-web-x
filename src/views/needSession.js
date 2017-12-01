import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'

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
    queryFlows: actions.query,
    redirect: replace,
  }, dispatch)
}

export class NeedSession extends Component {
  static propTypes = {
    authored: PropTypes.bool,
    authoring: PropTypes.bool,
    children: PropTypes.node,

    queryFlows: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { authored, queryFlows, authoring } = this.props
    if (!authored && !authoring) {
      this.toSignIn(true)
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

  toSignIn (replace) {
    // todo 记下当前页面后跳转, 用于登录后跳回
    if (replace) {
      /**
       * 由于直接访问 / 路径时如果没有登录则会跳转至 /signin 如果直接使用
       * location.href = '/signin' 时， 在 safari 中会导致 icon 偶尔无法显示
       * (刷新能显示， 但是直接访问地址仍然不能显示)
       * 可能的原因:
       * 1. 在 / 路径下 font 还未下载完，但由于跳转导致下载中断
       * 在 /signin 路径时，由于浏览器缓存关系使用的字体可能是未下载完的 font
       * 所以导致 icon 无法显示，由于登录之后的所有内部路径都使用 History 接口
       * 所以后续页面也将一直无法显示 icon
       * 同时点击刷新按钮是 font 使用请求缓存(304), 而直接访问猜测使用 memory cache,
       */
      const { redirect } = this.props
      redirect('/signin')
    } else {
      window.location.href = '/signin'
    }
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
