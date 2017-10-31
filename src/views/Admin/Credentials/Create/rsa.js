import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { Input } from 'components/Form/reduxForm'

import classes from './form.scss'

export function validate (values) {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  return errors
}
export default class CreateRsa extends Component {
  static propTypes = {
    // i18n: PropTypes.func,
  }

  render () {
    return <tbody>
      <tr>
        <td className={classes.name}>名称</td>
        <td>
          <Input name='name' />
        </td>
      </tr>
    </tbody>
  }
}
