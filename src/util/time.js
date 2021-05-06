import moment from 'moment'

export function timeDurationInSeconds (dateA, dateB) {
  return moment(dateA).diff(moment(dateB), 'seconds')
}

export function timeFormat(date) {
  return moment(date).format('YYYY-MM-DD kk:mm:ss')
}

export function timeFormatInMins(date) {
  return moment(date).format('YYYY-MM-DD kk:mm')
}

export function timeFormatFromNow(date) {
  return moment(date).fromNow()
}

export function utcTimeFormatFromNow(date) {
  return moment.utc(date).fromNow()
}
