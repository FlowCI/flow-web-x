import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'

import Input from 'components/Form/Input'
import Button from 'components/Button'

import { Section, SectionTitle } from '../components/Section'
import WebhookSection from '../components/WebhookSection'

import classes from './ssh.scss'

function mapStateToProps (state, { flowId }) {
  const { flow } = state
  return {
    flow: flow.getIn(['data', flowId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    done: actions.updateEnv,
    test: function () {},
    redirect: push,
  }, dispatch)
}

export class SSHConfig extends Component {
  static propTypes = {
    flow: ImmutablePropTypes.map,

    done: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    url: '',
  }

  componentWillReceiveProps (nextProps) {
    const { flow } = nextProps
    if (flow.getIn(['env', 'FLOW_STATUS']) === 'READY') {
      const { redirect } = nextProps
      redirect(`/flows/${flow.get('id')}`)
    }
  }

  handleUrlChange = (value) => {
    this.setState({ url: value })
  }

  handleDoneCick = () => {
    const { done, flow } = this.props
    const { url } = this.state
    return done(flow.get('id'), {
      FLOW_STATUS: 'READY',
      FLOW_GIT_URL: url
    })
  }

  handleTestClick = () => {
    const { test, flow } = this.props
    const { url } = this.state
    return test(flow.get('id'), {
      FLOW_GIT_URL: url
    })
  }

  valid (values) {
    const { url } = values
    return /^git@\w+\.\w+/.test(url)
  }

  renderGitUrl () {
    const { i18n } = this.props
    const { url } = this.state
    return <Section>
      <SectionTitle title={i18n('输入 Git 仓库地址')}
        question='link for doc'
      />
      <Input className={classes.addr} value={url}
        type='url' onChange={this.handleUrlChange}
        placeholder={i18n('例：git@github.com:FlowCI/flow-platform.git')} />
    </Section>
  }

  renderWebhook () {
    const { i18n, flow } = this.props
    const webhook = flow.getIn(['env', 'FLOW_GIT_WEBHOOK'])
    return <WebhookSection i18n={i18n} webhook={webhook} />
  }

  renderDeploy () {
    const { i18n } = this.props
    return <Section>
      <SectionTitle title={i18n('Deploy Key（可选）')}
        question='link for doc'
        subTitle={i18n('如没有 Git 仓库访问权限，请添加 Deploy Key 到 Git 仓库的项目或者用户设置')}
      />
    </Section>
  }

  renderActions () {
    const { i18n } = this.props
    const enabled = this.valid(this.state)

    return <div className={classes.actions}>
      <Button className='btn-primary'
        disabled={!enabled}
        onClick={this.handleDoneCick}
      >
        {i18n('完成')}
      </Button>
      <Button className='btn-inverse'
        disabled={!enabled}
        onClick={this.handleTestClick}
      >
        {i18n('连接测试')}
      </Button>
    </div>
  }

  render () {
    return <div>
      {this.renderGitUrl()}
      {this.renderWebhook()}
      {this.renderDeploy()}
      {this.renderActions()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSHConfig)
