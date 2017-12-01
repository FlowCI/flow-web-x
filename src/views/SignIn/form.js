import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'

import Button from 'components/Buttonx'
import { Input } from 'components/Form/reduxForm'

import classes from './form.scss'

export function validate (values) {
  const errors = {}
  if (!values.emailOrUsername) {
    errors.emailOrUsername = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export class SignInForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    submitting: PropTypes.bool,
    // error: PropTypes.object,
    i18n: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
  }

  render () {
    const { className, i18n, submitting, handleSubmit } = this.props
    return <form onSubmit={handleSubmit}
      className={`${classes.form} ${className}`}>
      <div className={classes.logo}>
        <i className='icon icon-logo' />
      </div>
      <Input type='text' name='emailOrUsername'
        leftIcon={<i className='icon icon-user' />}
        divider size='hg' className='block' />
      <Input type='password' name='password'
        leftIcon={<i className='icon icon-key' />}
        divider size='hg' className='block' />
      <Button className='block' type='primary'
        loading={submitting}
        size='lg' htmlType='submit'>
        {i18n('登录')}
      </Button>
    </form>
  }
}

export default reduxForm({
  validate,
  form: 'signIn'
})(SignInForm)
