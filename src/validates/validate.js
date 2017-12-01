import i18n from './i18n'
export function required (value) {
  return value === undefined || value === '' ? i18n('required') : undefined
}

export function email (value) {
  return value && !/^[A-Z0-9_+.-]+@([A-Z0-9-]+\.)+[A-Z0-9]{2,6}/i.test(value)
    ? i18n('not email') : undefined
}

export function url (value) {
  const reg = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/ // eslint-disable-line max-len
  return value && !reg.test(value) ? i18n('not url') : undefined
}

export function host (value) {
  const reg = /^[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.([a-z]{1,6}|[a-z0-9-]{1,30}\.[a-z]{2,3})$/i // eslint-disable-line max-len
  return value && !reg.test(value) ? i18n('not host') : undefined
}

export function number (value) {
  return value && isNaN(Number(value)) ? i18n('not number') : undefined
}

export function flowName (value = '') {
  return /\w{4,100}/.test(value) ? undefined : i18n('flow name invalid')
}

export function git (value = '') {
  return /^git@\w+\.\w+/.test(value) ? undefined : i18n('not git url')
}

export default {
  required,
  email,
  url,
  host,
  number,
  flowName,
  git,
}
