import createAdapter from '../createAdapter'
import createField from '../createField'

import Input from 'react-little-liar/src/Input'

export const InputAdapter = createAdapter(Input)

export default createField(InputAdapter)
