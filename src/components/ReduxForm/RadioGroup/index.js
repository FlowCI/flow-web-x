import createAdapter from '../createAdapter'
import createField from '../createField'

import Radio from 'rc-components/Radio'
import RadioGroup from 'rc-components/RadioGroup'

export const RadioGroupAdapter = createAdapter(RadioGroup, [])

const RadioGroupField = createField(RadioGroupAdapter)

export {
  Radio,
  RadioGroupField as RadioGroup,
}

export default RadioGroupField
