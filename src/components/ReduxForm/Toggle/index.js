import createSwitchAdapter from '../createSwitchAdapter'
import createField from '../createField'

import Toggle from 'rc-components/Toggle'

export const ToggleAdapter = createSwitchAdapter(Toggle)

export default createField(ToggleAdapter)
