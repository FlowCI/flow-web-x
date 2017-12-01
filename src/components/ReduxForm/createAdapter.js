import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './form.scss'

export class FieldSet extends Component {
  static propTypes = {
    adapterClassName: PropTypes.string,
    children: PropTypes.node,

    invalid: PropTypes.bool,
    extra: PropTypes.node,
    error: PropTypes.node,
  }

  renderWarning (error) {
    return <div className={classes.error}>
      {error}
    </div>
  }

  render () {
    const {
      invalid, extra, error,
      children, adapterClassName,
    } = this.props

    return <div className={classnames(classes.field, adapterClassName, {
      invalid,
      extra,
    })}>
      {children}
      {invalid && this.renderWarning(error)}
      {!!extra && <div className={classes.extra}>{extra}</div>}
    </div>
  }
}

export default function createAdapter (component, emptyValue) {
  const enabledInvalid = component.propTypes && component.propTypes.invalid
  class FormAdapter extends Component {
    static propTypes = {
      adapterClassName: PropTypes.string,
      /**
       * redux-form filed props
       * @see https://redux-form.com/7.1.2/docs/api/field.md/#input-props
       */
      input: PropTypes.object.isRequired,
      /**
       * redux-form filed props
       * @see https://redux-form.com/7.1.2/docs/api/field.md/#meta-props
       */
      meta: PropTypes.object.isRequired,
      i18n: PropTypes.func.isRequired,
      extra: PropTypes.node,
    }

    static defaultProps = {
      input: {},
      meta: {},
      i18n: function (n) { return n },
    }

    renderField (invalid) {
      const {
        input,
        meta, i18n, extra, // eslint-disable-line no-unused-vars
        adapterClassName, // eslint-disable-line no-unused-vars
        ...other
      } = this.props
      const props = {
        placeholder: i18n('placeholder'),
        ...input,
        ...other,
        value: input.value || (input.value === false ? false
          : emptyValue || input.value)
      }
      if (enabledInvalid) {
        props.invalid = invalid
      }
      return React.createElement(component, props)
    }

    render () {
      const { meta, extra, adapterClassName } = this.props
      const { error, pristine, submitFailed } = meta
      // 防止初始状态下为 invalid
      const invalid = !pristine || submitFailed ? !!error : false

      return <FieldSet invalid={invalid} extra={extra}
        adapterClassName={adapterClassName}
        error={error}>
        {this.renderField(invalid)}
      </FieldSet>
    }
  }
  return FormAdapter
}
