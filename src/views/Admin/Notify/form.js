import React, { Component } from 'react'
import { object, bool, func } from 'prop-types'

import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'

import {
  Input,
  RadioGroups,
  Radio,
} from 'components/Form/reduxForm'
import Button from 'components/Button'

import classes from './form.scss'

function validate (values) {
  const error = {}
  const { smtpUrl, smtpPort } = values
  // 暂时先只校验非空
  if (!smtpUrl) {
    error.smtpUrl = 'required'
  }
  if (!smtpPort) {
    error.smtpPort = 'required'
  }
  return error
}

export const formName = 'emailSetting'
function mapStateToProps (state, props) {
  return {
    values: getFormValues(formName)(state)
  }
}
export class EmailSettingForm extends Component {
  static propTypes = {
    values: object.isRequired,
    valid: bool,
    i18n: func.isRequired,
    handleSubmit: func.isRequired,
    onTest: func.isRequired,
  }

  handleTest = () => {
    const { onTest, values } = this.props
    return onTest && onTest(values)
  }

  render () {
    const { i18n, valid, handleSubmit } = this.props
    return <form onSubmit={handleSubmit} className={classes.form}>
      <table>
        <tbody>
          <tr>
            <td className={classes.name}>{i18n('smtpUrl')}</td>
            <td>
              <Input className={classes.input} size='lg' required
                name='smtpUrl' placeholder={i18n('smtpUrlPlaceholder')}
                onChange={this.handleSmtpUrlChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('smtpPort')}</td>
            <td>
              <Input className={classes.port} size='lg' required
                name='smtpPort' placeholder={i18n('smtpPortPlaceholder')}
                onChange={this.handleSmtpPortChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('sender')}</td>
            <td>
              <Input className={classes.input} size='lg' type='email'
                name='sender' placeholder={i18n('senderPlaceholder')}
                onChange={this.handleSenderChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>SMTP 用户身份验证</td>
            <td>
              <RadioGroups name='isAuthored'>
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
                name='username' placeholder={i18n('usernamePlaceholder')}
                onChange={this.handleUserNameChange}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('password')}</td>
            <td>
              <Input className={classes.input} type='password'
                size='lg' name='password'
                placeholder={i18n('passwordPlaceholder')}
                onChange={this.handlePasswordChange}
              />
              <Button className={`btn-default ${classes.test}`}
                disabled={!valid} onClick={this.handleTest}>
                {i18n('test')}
              </Button>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>&nbsp;</td>
            <td>
              <Button className={`btn-primary ${classes.save}`}
                size='lg' type='submit' disabled={!valid}>
                {i18n('save')}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  }
}

export default reduxForm({
  validate,
  form: formName
})(connect(mapStateToProps)(EmailSettingForm))
