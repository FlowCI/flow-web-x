import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'

import V from 'validates'

import Button from 'components/Buttonx'
import Input from 'components/ReduxForm/Input'

import { Section, SectionTitle } from '../components/Section'
import WebhookSection from '../components/WebhookSection'
import TestButton from '../components/TestButton'

import classes from './http.scss'

export const formName = 'httpConfigForm'
function mapStateToProps (state, { flowId }) {
  const values = getFormValues(formName)(state)
  return {
    values,
  }
}

export class HttpForm extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    webhook: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,

    pristine: PropTypes.bool,
    valid: PropTypes.bool,
    values: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  getTestEnvs () {
    const { source, type, values } = this.props
    return {
      ...values,
      type,
      source,
    }
  }

  renderGitUrl () {
    const { i18n } = this.props
    return <Section className={classes.section}>
      <SectionTitle title={i18n('输入 Git 仓库地址')}
        question='link for doc'
      />
      <Input className={classes.addr} name='url'
        type='url' validate={[V.url]}
        adapterClassName={classes.block}
        placeholder={i18n('例：https://github.com/FlowCI/flow-platform.git')} />
    </Section>
  }

  renderUserName () {
    const { i18n } = this.props
    return <Section className={classes.section}>
      <SectionTitle title={i18n('用户名')}
        question='link for doc'
      />
      <Input name='username' className={classes.input}
        adapterClassName={classes.block}
        type='text' placeholder='' validate={[V.required]} />
    </Section>
  }

  renderPassword () {
    const { i18n } = this.props

    return <Section className={classes.section}>
      <SectionTitle title={i18n('密码')}
        question='link for doc'
      />
      <Input name='password' className={classes.input}
        adapterClassName={classes.block}
        type='password' placeholder='' validate={[V.required]} />
    </Section>
  }

  renderWebhook () {
    const { i18n, webhook } = this.props
    return <WebhookSection i18n={i18n} webhook={webhook} />
  }

  renderActions () {
    const {
      i18n, flowId, valid,
      handleSubmit, pristine,
    } = this.props
    return <div className={classes.actions}>
      <Button type='primary'
        disabled={pristine}
        onClick={handleSubmit}
      >
        {i18n('下一步')}
      </Button>
      <TestButton envs={this.getTestEnvs()} flowId={flowId}
        i18n={i18n.createChild('test')} disabled={!valid}
      />
    </div>
  }

  render () {
    return <form>
      {this.renderGitUrl()}
      {this.renderUserName()}
      {this.renderPassword()}
      {this.renderWebhook()}
      {this.renderActions()}
    </form>
  }
}
export default reduxForm({
  form: formName,
})(connect(mapStateToProps)(HttpForm))
