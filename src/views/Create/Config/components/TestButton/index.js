import React, { Component } from 'react'
import { func, bool, string, object } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/flow'

import Button from 'components/Buttonx'

import Mapping from './mapping'
import classes from './button.scss'

function mapStateToProps (state, { flowId }) {
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  const status = f.getIn(['envs', 'FLOW_YML_STATUS'])
  const n = Mapping[status]
  return {
    loading: n > 0 && n < Mapping.GIT_LOADING,
    status,
    message: f.getIn(['envs', 'FLOW_YML_ERROR_MSG']),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    test: actions.doCreateTest,
    getTestResult: actions.getTestResult,
  }, dispatch)
}

export class TestButton extends Component {
  static propTypes = {
    loading: bool,
    disabled: bool,
    flowId: string.isRequired,
    status: string,
    message: string,

    envs: object,

    i18n: func.isRequired,
    test: func.isRequired,
    getTestResult: func.isRequired,

    // event callback
    onTest: func,
    onTestFinish: func,
  }

  state = {
    locked: this.props.loading,
    checked: false
  }

  componentDidMount () {
    if (this.props.loading) {
      const { getTestResult, flowId } = this.props
      getTestResult(flowId)
      this.setState({ checked: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { loading } = this.props
    const { loading: nextLoading } = nextProps
    if (loading !== nextLoading) {
      if (nextLoading) {
        const { getTestResult, flowId } = nextProps
        getTestResult(flowId)
        this.setState({ checked: true, locked: true })
      } else {
        const { onTestFinish } = this.props
        onTestFinish && onTestFinish()
      }
    }
  }

  componentWillUnmount () {
    this._mount = false
  }

  handleClick = () => {
    this.setState({ locked: true })
    const { envs, test, flowId, onTest } = this.props
    onTest && onTest()
    return test(flowId, envs)
  }

  renderButton () {
    const { disabled, i18n } = this.props
    return <Button className={classes.button}
      plain type='secondary' disabled={disabled}
      onClick={this.handleClick}
    >
      {i18n('连接测试')}
    </Button>
  }

  renderLoading () {
    const { i18n } = this.props
    return <span className={classes.text}>
      <i className={`icon icon-running ${classes.loading}`} />
      {i18n('正在测试')}
    </span>
  }

  renderError (message) {
    const { i18n } = this.props
    return <span className={`${classes.text} text-danger`}>
      <i className='icon icon-warning' />
      测试失败: {message}
      <Button type='text' loading={false} onClick={this.handleClick}>
        {i18n('重新测试')}
      </Button>
    </span>
  }

  renderNotFound () {

  }

  renderStatus (status) {
    if (status === 'ERROR') {
      return this.renderError(this.props.message || '未找到 .flow.yml 配置文件')
    }
    const { i18n } = this.props
    return <span className={classes.text}>
      <i className='icon icon-check text-success' />
      {i18n(status)}
    </span>
  }

  render () {
    const { locked, checked } = this.state
    if (!locked) {
      return this.renderButton()
    }
    if (checked) {
      const { status } = this.props
      if (status && status !== 'GIT_CONNECTING') {
        return this.renderStatus(status)
      }
    }
    return this.renderLoading()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['getTestResult'] })(TestButton)
)
