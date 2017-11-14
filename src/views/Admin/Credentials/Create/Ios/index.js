import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import { FieldArray } from 'redux-form'

import { Input } from 'components/Form/reduxForm'
import Mobileprovision from './mobileprovision'
import P12 from './p12'

import classes from '../form.scss'

export function validate (values) {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  return errors
}

export default class CreateIosCredential extends Component {
  static propTypes = {
    // i18n: PropTypes.func,
  }

  render () {
    return <tbody>
      <tr>
        <td className={classes.name}>
          名称
        </td>
        <td>
          <Input name='name' />
        </td>
      </tr>
      <tr>
        <td className={classes.name}>Mobileprovision</td>
        <td>
          <FieldArray name='mobileprovisions' component={Mobileprovision} />
        </td>
      </tr>

      <tr>
        <td className={classes.name}>p12-files</td>
        <td>
          <FieldArray name='p12s' component={P12} />
        </td>
      </tr>
    </tbody>
  }
}
