import React, { Component } from 'react'
import { func } from 'prop-types'
import { map } from 'react-immutable-proptypes'

import Input from 'components/Form/Input'
import RadioGroups from 'components/Form/RadioGroups'
import Radio from 'components/Form/Radio'
import Button from 'components/Button'

import classes from './form.scss'

export default class EmailSettingForm extends Component {
  static propTypes = {
    initValues: map,
    i18n: func.isRequired,
    onSubmit: func.isRequired,
    onTest: func.isRequired,
  }

  state = {}

  componentWillMount () {
    const { initValues } = this.props
    this.state = {
      values: initValues ? initValues.toJSON() : {}
    }
  }

  validate (values) {
    const { smtpUrl, smtpPort } = values
    // 暂时先只校验非空
    return !!(smtpUrl && smtpPort)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { values } = this.state
    const { onSubmit } = this.props
    if (this.validate(values)) {
      return onSubmit(values)
    }
  }

  handleTest = () => {
    const { onTest } = this.props
    const { values } = this.state
    if (this.validate(values)) {
      return onTest(values)
    }
  }

  handleSmtpUrlChange = (v) => {
    const { values } = this.state
    this.setState({ values: { ...values, smtpUrl: v } })
  }

  handleSmtpPortChange = (v) => {
    const { values } = this.state
    this.setState({ values: { ...values, smtpPort: v } })
  }

  handleSenderChange = (v) => {
    const { values } = this.state
    this.setState({ values: { ...values, sender: v } })
  }

  handleUserNameChange = (v) => {
    const { values } = this.state
    this.setState({ values: { ...values, username: v } })
  }

  handlePasswordChange = (v) => {
    const { values } = this.state
    this.setState({ values: { ...values, passowrd: v } })
  }

  render () {
    const { i18n } = this.props
    return <form onSubmit={this.handleSubmit} className={classes.form}>
      <table>
        <tbody>
          <tr>
            <td className={classes.name}>{i18n('smtpUrl')}</td>
            <td>
              <Input className={classes.input} size='lg' required
                placeholder={i18n('smtpUrlPlaceholder')}
                onChange={this.handleSmtpUrlChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('smtpPort')}</td>
            <td>
              <Input className={classes.port} size='lg' required
                placeholder={i18n('smtpPortPlaceholder')}
                onChange={this.handleSmtpPortChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('sender')}</td>
            <td>
              <Input className={classes.input} size='lg' type='email'
                placeholder={i18n('senderPlaceholder')}
                onChange={this.handleSenderChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>SMTP 用户身份验证</td>
            <td>
              <RadioGroups>
                <Radio rightLabel='开启' value='1' />
                <Radio rightLabel='关闭' value='0' />
              </RadioGroups>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>
              {i18n('username')}
            </td>
            <td>
              <Input className={classes.input} size='lg'
                placeholder={i18n('usernamePlaceholder')}
                onChange={this.handleUserNameChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('password')}</td>
            <td>
              <Input className={classes.input} type='password'
                size='lg' placeholder={i18n('passwordPlaceholder')}
                onChange={this.handlePasswordChange}
              />
              <Button className={`btn-default ${classes.test}`}
                onClick={this.handleTest}>
                {i18n('test')}
              </Button>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>&nbsp;</td>
            <td>
              <Button className={`btn-primary ${classes.save}`} size='lg' type='submit'>
                {i18n('save')}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  }
}
