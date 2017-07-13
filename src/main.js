import createResource from 'i18n'
import 'styles/core.scss'

const i18n = createResource({
  a: '1'
})

alert(i18n('a'))
