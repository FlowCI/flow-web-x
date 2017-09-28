import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FileInput from '../FileInput'
import Button from 'components/Button'
import IconButton from 'components/IconButton'

import classes from './mobileprovision.scss'

class Item extends Component {
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
      <div className={classes.item}>
        <FileInput name={name} accept='.mobileprovision' />
        <IconButton onClick={this.handleRemove} className={classes.remove}>
          <i className='icon icon-trash' />
        </IconButton>
      </div>
    </li>
  }
}

export default class MobileprovisionList extends Component {
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
        return <Item key={name} name={name}
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
