import React, { Component } from 'react'
import { func, string } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'

import Input from 'components/Form/Input'
import Button from 'components/Button'

import { Section, SectionTitle } from '../components/Section'
import WebhookSection from '../components/WebhookSection'
import TestButton from '../components/TestButton'

import classes from './http.scss'

function mapStateToProps (state, { flowId }) {
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  return {
    webhook: f.getIn(['envs', 'FLOW_GIT_WEBHOOK']),
    defaultGitUrl: f.getIn(['envs', 'FLOW_GIT_URL'], ''),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    done: actions.doneCreate,
    test: function () {},
  }, dispatch)
}

export class HTTPConfig extends Component {
  static propTypes = {
    flowId: string.isRequired,
    webhook: string.isRequired,
    defaultGitUrl: string,
    git: string,

    done: func.isRequired,
    test: func.isRequired,
    i18n: func.isRequired,
  }

  state = {
    url: this.props.defaultGitUrl,
    username: '',
    password: '',
  }

  getGitSource () {
    const { git } = this.props
    return git ? git.toUpperCase() : 'UNDEFINED_HTTP'
  }

  getValues () {
    const { url, username, password } = this.state
    return {
      type: 'HTTP',
      source: this.getGitSource(),
      url: url,
      username,
      password,
    }
  }

  handleUrlChange = (value) => {
    this.setState({ url: value })
  }

  handleUsernameChange = (value) => {
    this.setState({ username: value })
  }

  handlePasswordChange = (value) => {
    this.setState({ password: value })
  }

  handleDoneCick = () => {
    const { done, flowId } = this.props
    return done(flowId, this.getValues())
  }

  handleTestClick = () => {
    const { test, flowId } = this.props
    const { url } = this.state
    const source = this.getGitSource()
    return test(flowId, source, url)
  }

  valid (values) {
    const { url } = values
    return /^http/.test(url)
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
        placeholder={i18n('例：https://github.com/FlowCI/flow-platform.git')} />
    </Section>
  }

  renderUserName () {
    const { i18n } = this.props
    const { username } = this.state
    return <Section>
      <SectionTitle title={i18n('用户名')}
        question='link for doc'
      />
      <Input value={username} className={classes.input}
        type='text' onChange={this.handleUsernameChange}
        placeholder={i18n('')} />
    </Section>
  }

  renderPassword () {
    const { i18n } = this.props
    const { password } = this.state

    return <Section>
      <SectionTitle title={i18n('密码')}
        question='link for doc'
      />
      <Input value={password} className={classes.input}
        type='password' onChange={this.handlePasswordChange}
        placeholder={i18n('')} />
    </Section>
  }

  renderWebhook () {
    const { i18n, webhook } = this.props
    return <WebhookSection i18n={i18n} webhook={webhook} />
  }

  renderActions () {
    const { i18n, flowId } = this.props
    const values = this.getValues()
    const enabled = this.valid(values)

    return <div className={classes.actions}>
      <Button className='btn-primary'
        disabled={!enabled}
        onClick={this.handleDoneCick}
      >
        {i18n('下一步')}
      </Button>
      <TestButton
        envs={values}
        i18n={i18n.createChild('test')} disabled={!enabled}
        flowId={flowId}
      />
    </div>
  }

  render () {
    return <div>
      {this.renderGitUrl()}
      {this.renderUserName()}
      {this.renderPassword()}
      {this.renderWebhook()}
      {this.renderActions()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HTTPConfig)
