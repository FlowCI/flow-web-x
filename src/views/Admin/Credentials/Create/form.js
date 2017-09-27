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

  state = {
    name: ''
  }

  handleNameChange = (v) => {
    this.setState({ name: v })
  }

  handleCreate = () => {
    const { create } = this.props
    const { name } = this.state
    return create('RSA', name)
  }

  render () {
    const { name } = this.state
    return <form className={classes.form}>
      <table>
        <thead>
          <tr>
            <th className={classes.name}>类型</th>
            <th>
              <Select value='RSA'>
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
              <Input value={name} onChange={this.handleNameChange} />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>&nbsp;</td>
            <td>
              <Button className='btn-primary' onClick={this.handleCreate}>
                生成
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  }
}
