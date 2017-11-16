import createSwitchAdapter from '../createSwitchAdapter'
import createField from '../createField'

import Toggle from 'react-little-liar/src/Toggle'

export const ToggleAdapter = createSwitchAdapter(Toggle)

export default createField(ToggleAdapter)
