export function required (value) {
  return value === undefined || value === '' ? 'required' : undefined
}

export function email (value) {
  return value && !/^[A-Z0-9_+.-]+@([A-Z0-9-]+\.)+[A-Z0-9]{2,6}/i.test(value)
    ? 'not email' : undefined
}

export function url (value) {
  const reg = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/ // eslint-disable-line max-len
  return value && !reg.test(value) ? 'not url' : undefined
}

export function host (value) {
  const reg = /^[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.([a-z]{1,6}|[a-z0-9-]{1,30}\.[a-z]{2,3})$/i // eslint-disable-line max-len
  return value && !reg.test(value) ? 'not host' : undefined
}

export function number (value) {
  return value && isNaN(Number(value)) ? 'not number' : undefined
}

export default {
  required,
  email,
  url,
  host,
  number,
}
