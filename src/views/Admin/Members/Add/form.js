import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { reduxForm } from 'redux-form'

import Button from 'components/Button'
import { Input, Select, Option, Checkbox } from 'components/Form/reduxForm'

import FieldSet from './fieldset'

import classes from './form.scss'

export function validate (values) {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }
  if (!values.email) {
    errors.email = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  if (!values.role) {
    errors.role = 'Required'
  }
  return errors
}

export class CreateMemberForm extends Component {
  static propTypes = {
    invalid: PropTypes.bool,
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
      handleSubmit, invalid
    } = this.props
    return <form onSubmit={handleSubmit} className={classes.form}>
      <table className={classes.table}>
        <tbody>
          <FieldSet required text={i18n('用户名')}>
            <Input name='username' size='lg' className={classes.input} />
          </FieldSet>
          <FieldSet required text={i18n('邮箱')}>
            <Input type='email' name='email'
              size='lg' className={classes.input} />
          </FieldSet>
          <FieldSet required text={i18n('初始密码')}>
            <Input type='password' name='password'
              size='lg' className={classes.input} />
          </FieldSet>
          <FieldSet text={i18n('角色')}>
            <Select size='lg' name='role'
              loading={!loadedRoles}
              className={classes.select}>
              {roles.map((n) => <Option key={n} value={n} title={n} />)}
            </Select>
          </FieldSet>
          <FieldSet text={i18n('Flow授权')}>
            <Select size='lg' name='flow'
              loading={!loadedFlows}
              className={classes.select}>
              <Option value={false} title='无授权' />
              {flows.map((f) => <Option key={f} value={f} title={f} />)}
            </Select>
          </FieldSet>
          <FieldSet text={i18n('发送用户通知')}>
            <Checkbox name='isSendEmail' rightLabel={i18n('发送账户详情电子邮件')} />
          </FieldSet>
          <FieldSet>
            <Button className='btn-primary'
              loading={submitting} disabled={invalid}
              size='lg' type='submit'>
              {i18n('添加成员')}
            </Button>
          </FieldSet>
        </tbody>
      </table>
    </form>
  }
}

export default reduxForm({
  validate,
  form: 'createMemberForm',
  initialValues: {
    flow: false,
  }
})(CreateMemberForm)
