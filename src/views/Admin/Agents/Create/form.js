import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'

import { Input } from 'components/Form/reduxForm'
import Button from 'components/Button'

import classes from './form.scss'

export function validate (values) {
  const errors = {}
  const { zone, name } = values
  if (!zone) {
    errors.zone = 'Required'
  }
  if (!name) {
    errors.name = 'Required'
  }
  return errors
}

export const formName = 'createAgentForm'
export class CreateAgentForm extends Component {
  static propTypes = {
    invalid: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
  }

  render () {
    const { invalid, submitting, handleSubmit } = this.props
    return <form onSubmit={handleSubmit} className={classes.form}>
      <table>
        <tbody>
          <tr>
            <td className={classes.name}>Zone:</td>
            <td>
              <Input name='zone' readOnly />
            </td>
          </tr>
          <tr>
            <td className={classes.name}>Name:</td>
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
                disabled={invalid} loading={submitting}>
                生成
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  }
}

export default reduxForm({
  validate,
  form: formName,
  initialValues: {
    zone: 'default'
  }
})(CreateAgentForm)
