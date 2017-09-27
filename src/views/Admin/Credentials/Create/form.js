import React, { Component } from 'react'
import { func } from 'prop-types'

import { Select, Option, Input } from 'components/Form'
import Button from 'components/Button'

import classes from './form.scss'

export default class CreateCredentialForm extends Component {
  static propTypes = {
    onSubmit: func.isRequired,
  }

  render () {
    const { onSubmit } = this.props
    return <form className={classes.form}>
      <table>
        <thead>
          <tr>
            <th className={classes.name}>类型</th>
            <th>
              <Select name='type' >
                <Option value='RSA'>RSA Key</Option>
                <Option value='IOS'>iOS 证书</Option>
              </Select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.name}>名称</td>
            <td>
              <Input name='name' />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>&nbsp;</td>
            <td>
              <Button className='btn-primary' type='submit'
                onSubmit={onSubmit}>
                生成
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  }
}
