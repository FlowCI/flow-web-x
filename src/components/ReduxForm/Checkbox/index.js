import createSwitchAdapter from '../createSwitchAdapter'
import createField from '../createField'

import Checkbox from 'rc-components/Checkbox'

export const CheckboxAdapter = createSwitchAdapter(Checkbox)

export default createField(CheckboxAdapter)
