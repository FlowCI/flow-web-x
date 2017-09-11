import React, { Component } from 'react'
import { any, func } from 'prop-types'
import Checkbox from '../Checkbox'

const checkedIcon = <i className='icon checked icon-radio-checked' />
const unCheckedIcon = <i className='icon unchecked icon-radio-unchecked' />

export { classes } from '../Checkbox'

export default class Radio extends Component {
  static propTypes = {
    value: any,
    onSelect: func,
  }

  handleChange = () => {
    const { value, onSelect } = this.props
    return onSelect && onSelect(value)
  }

  render () {
    return <Checkbox {...this.props} type='radio'
      checkedIcon={checkedIcon}
      unCheckedIcon={unCheckedIcon}
      onChange={this.handleChange}
    />
  }
}
