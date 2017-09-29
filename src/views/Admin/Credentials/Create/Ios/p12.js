import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Input } from 'components/Form/reduxForm'
import Button from 'components/Button'
import IconButton from 'components/IconButton'

import FileInput from '../FileInput'

import classes from './p12.scss'

export class P12Item extends Component {
  static propTypes = {
    name: PropTypes.any,
    index: PropTypes.number,

    remove: PropTypes.func.isRequired,
  }

  handleRemove = () => {
    const { remove, index } = this.props
    remove(index)
  }

  render () {
    const { name } = this.props
    return <li>
      <div className={classes.panel}>
        <FileInput accept='.p12' name={`${name}.file`} className={classes.fileInput} />
        <div className={classes.group}>
          <Input type='password' name={`${name}.password`} />
          <IconButton onClick={this.handleRemove} className={classes.remove}>
            <i className='icon icon-trash' />
          </IconButton>
        </div>
      </div>
    </li>
  }
}

export default class P12List extends Component {
  static propTypes = {
    fields: PropTypes.any,
  }

  componentDidMount () {
    this.createItem()
  }

  createItem = () => {
    const { fields } = this.props
    fields.push()
  }

  removeItem = (index) => {
    const { fields } = this.props
    fields.remove(index)
  }

  render () {
    const { fields } = this.props
    return <ul className={classes.list}>
      {fields.map((name, index) => {
        return <P12Item key={name} name={name}
          index={index} remove={this.removeItem} />
      })}
      <li>
        <Button onClick={this.createItem}
          className='btn-primary btn-sm'>
          添加
        </Button>
      </li>
    </ul>
  }
}
