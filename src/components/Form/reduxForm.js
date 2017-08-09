/*
  this is redux form adapter
*/
import React from 'react'
import PropTypes from 'prop-types'

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

export const ReduxFormAutoComplete = createReduxFormAdapter(AutoComplete)
export const ReduxFormCheckbox = createReduxFormAdapter(Checkbox)
export const ReduxFormInput = createReduxFormAdapter(Input)
export const ReduxFormRadio = createReduxFormAdapter(Radio)
export const ReduxFormRadioGroups = createReduxFormAdapter(RadioGroups)
export const ReduxFormSelect = createReduxFormAdapter(Select)
