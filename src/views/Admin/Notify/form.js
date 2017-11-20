import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'

import V from 'validates'
import Button from 'components/Buttonx'
import { FormItem } from 'components/ReduxForm'
import Input from 'components/ReduxForm/Input'
import Toggle from 'components/ReduxForm/Toggle'
import Collapse from 'components/Collapse'

import classes from './form.scss'

export const formName = 'emailSetting'
function mapStateToProps (state, props) {
  const values = getFormValues(formName)(state)
  return {
    values,
  }
}
/**
 * 注意，当表单被移除后，在 onSubmit 时也能拿到其值，需要过滤掉
 */
export class EmailSettingForm extends Component {
  static propTypes = {
    values: PropTypes.object.isRequired,
    valid: PropTypes.bool,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    i18n: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onTest: PropTypes.func.isRequired,
  }

  handleTest = () => {
    const { valid, onTest, values, handleSubmit } = this.props
    if (valid) {
      return onTest && onTest(values)
    } else {
      handleSubmit() // 用于触发 submit error
    }
  }

  render () {
    const {
      values: { isAuthenticated },
      i18n, handleSubmit, submitting,
      pristine
    } = this.props
    const itemClass = {
      label: classes.label,
      control: classes.control,
    }
    return <form className={classes.form}>
      <FormItem label={i18n('smtpUrl.label')} classNames={itemClass}>
        <Input name='smtpUrl' i18n={i18n.createChild('smtpUrl')}
          size='lg' validate={[V.required, V.host]} />
      </FormItem>
      <FormItem label={i18n('smtpPort.label')} classNames={itemClass}>
        <Input name='smtpPort' type='text' className={classes.port}
          i18n={i18n.createChild('smtpPort')} size='lg'
          autoComplete={false}
          validate={[V.required, V.number]} />
      </FormItem>
      <FormItem label={i18n('sender.label')} classNames={itemClass}>
        <Input name='sender' type='email'
          i18n={i18n.createChild('sender')} size='lg'
          validate={[V.required, V.email]} />
      </FormItem>
      <FormItem label={i18n('SMTP 用户身份验证')} classNames={itemClass}>
        <Toggle name='isAuthenticated' />
      </FormItem>
      <Collapse>
        {isAuthenticated && <div>
          <FormItem label={i18n('username.label')} classNames={itemClass}>
            <Input name='username'
              i18n={i18n.createChild('username')} size='lg'
              validate={[V.required]} />
          </FormItem>
          <FormItem label={i18n('password.label')} classNames={itemClass}>
            <Input name='password' type='password'
              adapterClassName={classes.mr10}
              i18n={i18n.createChild('password')} size='lg'
              validate={[V.required]} />
            <Button onClick={this.handleTest}>
              {i18n('test')}
            </Button>
          </FormItem>
        </div>}
      </Collapse>
      <FormItem classNames={itemClass}>
        <Button size='lg' type='primary' htmlType='submit'
          onClick={handleSubmit} loading={submitting}
          disabled={pristine}>
          {i18n('save')}
        </Button>
      </FormItem>
    </form>
  }
}

export default reduxForm({
  form: formName,
  enableReinitialize: true
})(connect(mapStateToProps)(EmailSettingForm))
