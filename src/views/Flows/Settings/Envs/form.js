import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'
import { Input } from 'components/Form/reduxForm'
import Button from 'components/Button'

import classes from './form.scss'
export function validate (values) {
  const errors = {}
  if (!values.key) {
    errors.key = 'Required'
  }
  if (!values.value) {
    errors.value = 'Required'
  }
  return errors
}

export class FlowEnvForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
  }

  render () {
    const { className } = this.props
    return (
      <div className={className}>
        <Input name='key' size='lg' placeholder='key'
          className={classes.control} />
        <Input name='value' size='lg' placeholder='key'
          className={classes.control} />
        <Button className={classes.save} size='lg'>
          添加
        </Button>
      </div>
    )
  }
}

export default reduxForm({
  form: 'FlowEnvForm',
  validate,
})(FlowEnvForm)
