import createResource from 'i18n'

export default function createI18n (locale) {
  const resource = require(`./locale/${locale}`).default
  return createResource(resource)
}
