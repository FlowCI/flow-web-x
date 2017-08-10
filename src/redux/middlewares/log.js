import is from 'util/is'

export default function ({ dispatch, getState }) {
  return (next) => (action) => {
    const r = next(action)
    if (is.promise(r)) {
      r.catch(console.error)
    }
    return r
  }
}
