import React, { Component } from 'react'
import { func } from 'prop-types'

import { Select, Option } from 'components/Form/Select'
import Input from 'components/Form/Input'
import Button from 'components/Button'

import classes from './form.scss'

export default class CreateCredential extends Component {
  static propTypes = {
    create: func,
  }

  render () {
    return <form className={classes.form}>
      <table>
        <tbody>
          <tr>
            <td className={classes.name}>类型</td>
            <td>
              <Select value='rsa'>
                <Option value='rsa'>RSA Key</Option>
                <Option value='ios'>iOS 证书</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td className={classes.name}>名称</td>
            <td>
              <Input />
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <Button className='btn-primary'>生成</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  }
}
