import React from 'react'
import { Field } from 'redux-form'

export default function createField (component) {
  return function ReduxFormField (props) {
    return <Field {...props} component={component} />
  }
}
