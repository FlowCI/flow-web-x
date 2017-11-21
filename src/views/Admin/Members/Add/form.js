import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { reduxForm } from 'redux-form'

import V from 'validates'
import { FormItem } from 'components/ReduxForm'
import Input from 'components/ReduxForm/Input'
import Checkbox from 'components/ReduxForm/Checkbox'
import { Select, Option } from 'components/ReduxForm/Select'
import Button from 'components/Buttonx'

import classes from './form.scss'

export class CreateMemberForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    // error: PropTypes.object,
    loadedRoles: PropTypes.bool,
    loadedFlows: PropTypes.bool,

    flows: ImmutablePropTypes.list.isRequired,
    roles: ImmutablePropTypes.list.isRequired,

    i18n: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
  }

  render () {
    const {
      flows, roles,
      loadedFlows, loadedRoles,
      i18n, submitting,
      handleSubmit
    } = this.props
    const itemClass = {
      label: classes.label,
      control: classes.control,
    }

    return <form onSubmit={handleSubmit} className={classes.form}>
      <FormItem label={i18n('username.label')} classNames={itemClass}>
        <Input name='username' i18n={i18n.createChild('username')}
          size='lg' validate={[V.required]} />
      </FormItem>
      <FormItem label={i18n('email.label')} classNames={itemClass}>
        <Input name='email' type='email' i18n={i18n.createChild('email')}
          size='lg' validate={[V.required, V.email]} />
      </FormItem>
      <FormItem label={i18n('password.label')} classNames={itemClass}>
        <Input name='password' type='password'
          i18n={i18n.createChild('password')}
          size='lg' validate={[V.required]} />
      </FormItem>
      <FormItem label={i18n('role.label')} classNames={itemClass}>
        <Select name='role' size='lg' loading={!loadedRoles}
          i18n={i18n.createChild('role')}
          className={classes.roles}>
          {roles.map((n) => <Option key={n} value={n} label={n} />)}
        </Select>
      </FormItem>
      <FormItem label={i18n('flow.label')} classNames={itemClass}>
        <Select name='flow' size='lg' loading={!loadedFlows}
          i18n={i18n.createChild('flow')}
          className={classes.flows}>
          <Option value={false} label='无授权' />
          {flows.map((n) => <Option key={n} value={n} label={n} />)}
        </Select>
      </FormItem>
      <FormItem label={i18n('isSendEmail.label')} classNames={itemClass}>
        <Checkbox name='isSendEmail' label={i18n('isSendEmail.desc')} />
      </FormItem>
      <FormItem classNames={itemClass}>
        <Button type='primary'
          loading={submitting}
          size='lg' htmlType='submit'>
          {i18n('save')}
        </Button>
      </FormItem>
    </form>
  }
}

export default reduxForm({
  form: 'createMemberForm',
  initialValues: {
    flow: false,
  }
})(CreateMemberForm)
