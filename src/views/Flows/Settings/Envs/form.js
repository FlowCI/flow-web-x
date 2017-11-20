import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from '../i18n'
import language from 'util/language'

import { reduxForm } from 'redux-form'

import V from 'util/validate'
import Input from 'components/ReduxForm/Input'
import Button from 'components/Buttonx'

import classes from './form.scss'

export class FlowEnvForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('Envs'),
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.submitting && !nextProps.submitting &&
      nextProps.submitSucceeded) {
      nextProps.reset()
    }
  }

  render () {
    const { className, submitting, handleSubmit, i18n } = this.props
    return (
      <form className={className}>
        <Input name='name' size='lg' i18n={i18n.createChild('name')}
          className={classes.control} validate={[V.required]} />
        <Input name='value' size='lg' i18n={i18n.createChild('value')}
          className={classes.control} validate={[V.required]} />
        <Button size='lg' type='secondary'
          loading={submitting} onClick={handleSubmit}>
          添加
        </Button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'FlowEnvForm',
})(FlowEnvForm)
