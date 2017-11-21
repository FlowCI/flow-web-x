import React, { Component } from 'react'
import { string, func } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'

import V from 'validates'
import Input from 'react-little-liar/src/Input'
import { FieldSet } from 'components/ReduxForm/createAdapter'
import Button from 'components/Buttonx'
import { Section, SectionTitle } from '../components/Section'
import WebhookSection from '../components/WebhookSection'
import TestButton from '../components/TestButton'
import DeployList from './deploy'

import classes from './ssh.scss'

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
    test: actions.doCreateTest,
  }, dispatch)
}

export class SSHConfig extends Component {
  static propTypes = {
    flowId: string.isRequired,
    webhook: string.isRequired,
    defaultGitUrl: string,
    git: string,

    done: func.isRequired,
    i18n: func.isRequired,
  }

  state = {
    url: this.props.defaultGitUrl,
    deployKey: '',
  }

  getGitSource () {
    const { git } = this.props
    return git ? git.toUpperCase() : 'UNDEFINED_SSH'
  }

  getValues () {
    const { url, deployKey } = this.state
    return {
      type: 'SSH',
      source: this.getGitSource(),
      url: url,
      deploy: deployKey,
    }
  }

  handleUrlChange = (value) => {
    const error = V.git(value)
    this.setState({ url: value, error })
  }

  handleDoneCick = () => {
    const { done, flowId } = this.props
    return done(flowId, this.getValues())
  }

  handleDeploySelect = (deploy, selected) => {
    const name = selected ? deploy.get('name') : ''
    this.setState({ deployKey: name })
  }

  renderGitUrl () {
    const { i18n } = this.props
    const { url, error } = this.state
    return <Section className={classes.form}>
      <SectionTitle title={i18n('输入 Git 仓库地址')}
        question='link for doc'
      />
      <FieldSet error={error} invalid={!!error}
        adapterClassName={classes.field}>
        <Input className={classes.addr} value={url}
          invalid={!!error} type='url'
          onChange={this.handleUrlChange}
          placeholder={i18n('例：git@github.com:FlowCI/flow-platform.git')} />
      </FieldSet>
    </Section>
  }

  renderWebhook () {
    const { i18n, webhook } = this.props
    return <WebhookSection i18n={i18n} webhook={webhook} />
  }

  renderDeploy () {
    const { i18n } = this.props
    const { deployKey } = this.state
    return <DeployList i18n={i18n} selected={deployKey}
      onSelect={this.handleDeploySelect} />
  }

  renderActions () {
    const { i18n, flowId } = this.props
    const { error, url } = this.state
    const values = this.getValues()
    const enabled = url && !error

    return <div className={classes.actions}>
      <Button type='primary'
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
      {this.renderWebhook()}
      {this.renderDeploy()}
      {this.renderActions()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSHConfig)
