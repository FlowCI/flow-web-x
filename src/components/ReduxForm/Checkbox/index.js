import createSwitchAdapter from '../createSwitchAdapter'
import createField from '../createField'

import Checkbox from 'react-little-liar/src/Checkbox'

export const CheckboxAdapter = createSwitchAdapter(Checkbox)

export default createField(CheckboxAdapter)
