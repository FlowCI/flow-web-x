import createAdapter from '../createAdapter'
import createField from '../createField'

import Radio from 'react-little-liar/src/Radio'
import RadioGroup from 'react-little-liar/src/RadioGroup'

export const RadioGroupAdapter = createAdapter(RadioGroup)

const RadioGroupField = createField(RadioGroupAdapter)

export {
  Radio,
  RadioGroupField as RadioGroup,
}

export default RadioGroupField
