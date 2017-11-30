import React from 'react'

import _i18n from './i18n'
import NavbarContainer from '../components/NavbarContainer'

export default function PluginContainer (props) {
  return <NavbarContainer i18n={_i18n} base='/admin/plugins' {...props} />
}
