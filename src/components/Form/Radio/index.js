import React from 'react'
import Checkbox from '../Checkbox'

const checkedIcon = <i className='icon checked icon-radio-checked' />
const unCheckedIcon = <i className='icon unchecked icon-radio-unchecked' />

export default function Radio (props) {
  return <Checkbox {...props} type='radio'
    checkedIcon={checkedIcon}
    unCheckedIcon={unCheckedIcon} />
}
