/*
  this is redux form adapter
*/
import React from 'react'
import PropTypes from 'prop-types'

import { Field } from 'redux-form'

import AutoComplete from './AutoComplete'
import Checkbox from './Checkbox'
import Input from './Input'
import Radio from './Radio'
import RadioGroups from './RadioGroups'
import { Select, Option } from './Select'

export function createReduxFormAdapter (Component) {
  function ReduxFormAdapter (props) {
    const {
      input,
      ...other,
    } = props
    return <Component {...input} {...other} />
  }
  ReduxFormAdapter.propTypes = {
    input: PropTypes.any,
  }
  return ReduxFormAdapter
}

export function createCheckboxAdapter (Component) {
  function CheckboxReduxFormAdapter (props) {
    const {
      input,
      ...other,
    } = props
    return <Component {...input} {...other} checked={!!input.value} />
  }
  CheckboxReduxFormAdapter.propTypes = {
    input: PropTypes.any,
  }
  return CheckboxReduxFormAdapter
}
export const CheckboxAdapter = createCheckboxAdapter(Checkbox)
export const RadioGroupsAdapter = createCheckboxAdapter(RadioGroups)
export const AutoCompleteAdapter = createReduxFormAdapter(AutoComplete)
export const InputAdapter = createReduxFormAdapter(Input)
export const SelectAdapter = createReduxFormAdapter(Select)

export function createReduxFormField (Component) {
  function ReduxFormFieldWrapper (props) {
    return <Field {...props} component={Component} />
  }
  return ReduxFormFieldWrapper
}

const ReduxFormAutoComplete = createReduxFormField(AutoCompleteAdapter)
const ReduxFormCheckbox = createReduxFormField(CheckboxAdapter)
const ReduxFormInput = createReduxFormField(InputAdapter)
const ReduxFormRadioGroups = createReduxFormField(RadioGroupsAdapter)
const ReduxFormSelect = createReduxFormField(SelectAdapter)

export {
  ReduxFormAutoComplete as AutoComplete,
  ReduxFormCheckbox as Checkbox,
  ReduxFormInput as Input,
  Radio,
  ReduxFormRadioGroups as RadioGroups,
  ReduxFormSelect as Select,
  Option,
}
