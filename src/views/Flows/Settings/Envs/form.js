import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'
import { Input } from 'components/Form/reduxForm'
import Button from 'components/Button'

import classes from './form.scss'
export function validate (values) {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  if (!values.value) {
    errors.value = 'Required'
  }
  return errors
}

export class FlowEnvForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.submitting && !nextProps.submitting &&
      nextProps.submitSucceeded) {
      nextProps.reset()
    }
  }

  render () {
    const { className, submitting, handleSubmit } = this.props
    return (
      <form className={className}>
        <Input name='name' size='lg' placeholder='key'
          className={classes.control} />
        <Input name='value' size='lg' placeholder='value'
          className={classes.control} />
        <Button className={classes.save} size='lg'
          loading={submitting} onClick={handleSubmit}>
          添加
        </Button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'FlowEnvForm',
  validate,
})(FlowEnvForm)
