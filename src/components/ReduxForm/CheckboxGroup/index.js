import createAdapter from '../createAdapter'
import createField from '../createField'

import Checkbox from 'react-little-liar/src/Checkbox'
import CheckboxGroup from 'react-little-liar/src/CheckboxGroup'

export const CheckboxGroupAdapter = createAdapter(CheckboxGroup)

const CheckboxGroupField = createField(CheckboxGroupAdapter)

export {
  Checkbox,
  CheckboxGroupField as CheckboxGroup,
}

export default CheckboxGroupField
