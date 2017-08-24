import React, { Component } from 'react'
import { func, string, object } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/flow'

import Button from 'components/Button'

import classes from './button.scss'

const LOADING = 'LOADING'

function mapStateToProps (state, { flowId }) {
  // const { flow } = state
  // const f = flow.getIn(['data', flowId])
  return {
    // LOADING GIT_CONNECTING GIT_CONNECTED YML_VERIFIING YML_VERIFIED
    status: 'ERROR' // f.getIn(['envs', 'FLOW_YML_STATUS'])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    test: actions.doCreateTest,
    getTestResult: actions.getCreateTestResult,
  }, dispatch)
}

export class TestButton extends Component {
  static propTypes = {
    flowId: string.isRequired,
    status: string,

    envs: object,

    i18n: func.isRequired,
    test: func.isRequired,
    getTestResult: func.isRequired,
  }

  state = {
    loading: false
  }

  componentDidMount () {
    if (this.props.status === LOADING) {
      const { getTestResult, flowId } = this.props
      getTestResult(flowId)
      this.setState({ loading: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { status } = this.props
    const { status: nextStatus } = nextProps
    if (status !== nextStatus && nextStatus === LOADING) {
      const { getTestResult, flowId } = nextProps
      getTestResult(flowId)
      this.setState({ loading: true })
    }
  }

  handleClick = () => {
    this.setState({ loading: true })
    const { envs, test, flowId } = this.props
    return test(flowId, envs)
  }

  renderButton () {
    const { i18n } = this.props
    return <Button className={classes.button}
      onClick={this.handleClick}
    >
      {i18n('连接测试')}
    </Button>
  }

  renderLoading () {
    const { i18n } = this.props
    return <span className={classes.text}>
      <i className={`icon icon-sync ${classes.loading}`} />
      {i18n('正在测试')}
    </span>
  }

  renderError () {
    const { i18n } = this.props
    return <span className={`${classes.text} text-danger`}>
      <i className='icon icon-warning' />
      {i18n('测试失败: 无git访问权限')}
      <Button className='btn-link'>
        {i18n('重新测试')}
      </Button>
    </span>
  }

  renderSuccess (status) {
    const { i18n } = this.props
    return <span className={classes.text}>
      <i className='icon icon-check text-success' />
      {i18n(status)}
    </span>
  }

  render () {
    const { status } = this.props
    const { loading } = this.state

    let dom
    switch (status) {
      case 'ERROR':
        dom = this.renderError()
        break
      case 'GIT_CONNECTED':
      case 'YML_VERIFIING':
      case 'YML_VERIFIED':
        dom = this.renderSuccess(status)
        break
      case 'GIT_CONNECTING':
        dom = this.renderLoading()
        break
      default:
        dom = loading ? this.renderLoading() : this.renderButton()
    }
    return dom
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['getTestResult'] })(TestButton)
)
