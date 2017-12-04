import createResource from 'i18n'
import language from 'util/language'

export function getI18n (locale) {
  const resource = require(`./locale/${locale}`).default
  return createResource(resource)
}

export default getI18n(language)
