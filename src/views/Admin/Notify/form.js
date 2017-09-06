import React, { Component } from 'react'
import { object, func } from 'prop-types'

import Input from 'components/Form/Input'
import RadioGroups from 'components/Form/RadioGroups'
import Radio from 'components/Form/Radio'
import Button from 'components/Button'

import classes from './form.scss'

export default class EmailSettingForm extends Component {
  static propTypes = {
    initValues: object,
    i18n: func.isRequired,
  }

  state = this.props.initValues || {}

  handleSubmit = (e) => {
    e.preventDefault()
  }

  render () {
    const { i18n } = this.props
    return <form onSubmit={this.handleSubmit} className={classes.form}>
      <table>
        <tbody>
          <tr>
            <td className={classes.name}>{i18n('smtpUrl')}</td>
            <td>
              <Input className={classes.input} size='lg'
                placeholder={i18n('smtpUrlPlaceholder')} />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('smtpPort')}</td>
            <td>
              <Input className={classes.port} size='lg' />
              <span className={classes.desc}>
                {i18n('smtpPortPlaceholder')}
              </span>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('sender')}</td>
            <td>
              <Input className={classes.input} size='lg' type='email'
                placeholder={i18n('senderPlaceholder')}
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
              <Input className={classes.input}
                placeholder={i18n('usernamePlaceholder')}
                size='lg' />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>{i18n('password')}</td>
            <td>
              <Input className={classes.input}
                size='lg' placeholder={i18n('passwordPlaceholder')} />
              <Button className={`btn-default ${classes.test}`}>
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
