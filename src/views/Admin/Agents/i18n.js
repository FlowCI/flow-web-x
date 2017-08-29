import createResource from 'i18n'

export default function getI18n (locale) {
  const resource = require(`./locale/${locale}`).default
  return createResource(resource)
}
