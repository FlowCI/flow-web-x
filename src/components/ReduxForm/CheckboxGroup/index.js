import createAdapter from '../createAdapter'
import createField from '../createField'

import { Checkbox, CheckboxGroup } from 'react-little-liar'

export const CheckboxGroupAdapter = createAdapter(CheckboxGroup, [])

const CheckboxGroupField = createField(CheckboxGroupAdapter)

export {
  Checkbox,
  CheckboxGroupField as CheckboxGroup,
}

export default CheckboxGroupField
