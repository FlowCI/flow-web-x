import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'

import V from 'util/validate'
import { FormItem } from 'components/ReduxForm'
import Input from 'components/ReduxForm/Input'
import Button from 'components/Buttonx'

import classes from './form.scss'

export const formName = 'createAgentForm'
export class CreateAgentForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    i18n: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  render () {
    const { submitting, i18n, handleSubmit } = this.props
    const itemClass = {
      label: classes.label,
      control: classes.control,
    }
    return <form onSubmit={handleSubmit} className={classes.form}>
      <FormItem label={i18n('zone.label')} classNames={itemClass}>
        <Input name='zone' i18n={i18n.createChild('zone')}
          size='lg' validate={[V.required]} disabled />
      </FormItem>
      <FormItem label={i18n('name.label')} classNames={itemClass}>
        <Input name='name' i18n={i18n.createChild('name')}
          size='lg' validate={[V.required]} />
      </FormItem>
      <FormItem classNames={itemClass}>
        <Button type='primary' htmlType='submit'
          onClick={handleSubmit} loading={submitting}>
          {i18n('save')}
        </Button>
      </FormItem>
    </form>
  }
}

export default reduxForm({
  form: formName,
  initialValues: {
    zone: 'default'
  }
})(CreateAgentForm)
