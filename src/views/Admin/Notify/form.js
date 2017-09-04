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
    return <form onSubmit={this.handleSubmit} className={classes.form}>
      <tabel>
        <tbody>
          <tr>
            <td className={classes.name}>SMTP 服务器</td>
            <td>
              <Input className={classes.input} size='lg'
                placeholder='SMTP 服务器地址' />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>SMTP 端口</td>
            <td>
              <Input className={classes.port} size='lg' />
              <span className={classes.desc}>默认不需要修改</span>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>发信人邮箱</td>
            <td>
              <Input className={classes.input} size='lg' type='email' />
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
            <td className={classes.name}>验证用户名</td>
            <td>
              <Input className={classes.input}
                size='lg' placeholder='SMTP 用户名' />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>验证密码</td>
            <td>
              <Input className={classes.input}
                size='lg' placeholder='SMTP 密码' />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>&nbsp;</td>
            <td>
              <Button className='btn-primary' size='lg' type='submit'>
                保存
              </Button>
            </td>
          </tr>
        </tbody>
      </tabel>
    </form>
  }
}
