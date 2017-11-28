const enumStatus = {
  failure: -1,
  cancel: 0,
  send: 1,
  success: 2,
}

export function isSuccess (s) {
  return s === enumStatus.success
}

export function isSend (s) {
  return s === enumStatus.send
}

export default enumStatus
