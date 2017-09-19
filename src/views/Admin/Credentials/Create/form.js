import React, { Component } from 'react'
import { func } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/credential'

import { Select, Option } from 'components/Form/Select'
import Input from 'components/Form/Input'
import Button from 'components/Button'

import classes from './form.scss'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
  }, dispatch)
}

export class CreateCredential extends Component {
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
    return create('rsa', name)
  }

  render () {
    const { name } = this.state
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
              <Input value={name} onChange={this.handleNameChange} />
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <Button className='btn-primary' onClick={this.handleCreate}>
                生成
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  }
}
export default connect(undefined, mapDispatchToProps)(CreateCredential)
