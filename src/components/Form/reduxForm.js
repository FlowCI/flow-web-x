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

export const ReduxFormAutoComplete = createReduxFormField(AutoCompleteAdapter)
export const ReduxFormCheckbox = createReduxFormField(CheckboxAdapter)
export const ReduxFormInput = createReduxFormField(InputAdapter)
export const ReduxFormRadio = createReduxFormField(RadioAdapter)
export const ReduxFormRadioGroups = createReduxFormField(RadioGroupsAdapter)
export const ReduxFormSelect = createReduxFormField(SelectAdapter)
