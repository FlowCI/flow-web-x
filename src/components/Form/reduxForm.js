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
import Select from './Select'

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

export const AutoCompleteAdapter = createReduxFormAdapter(AutoComplete)
export const CheckboxAdapter = createReduxFormAdapter(Checkbox)
export const InputAdapter = createReduxFormAdapter(Input)
export const RadioAdapter = createReduxFormAdapter(Radio)
export const RadioGroupsAdapter = createReduxFormAdapter(RadioGroups)
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
const ReduxFormRadio = createReduxFormField(RadioAdapter)
const ReduxFormRadioGroups = createReduxFormField(RadioGroupsAdapter)
const ReduxFormSelect = createReduxFormField(SelectAdapter)

export {
  ReduxFormAutoComplete as AutoComplete,
  ReduxFormCheckbox as Checkbox,
  ReduxFormInput as Input,
  ReduxFormRadio as Radio,
  ReduxFormRadioGroups as RadioGroups,
  ReduxFormSelect as Select,
}
