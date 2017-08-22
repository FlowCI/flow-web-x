import databases from './bundle'

let mapping = databases

if (module.hot) {
  module.hot.accept('./bundle', () => {
    mapping = require('./bundle').default
  })
}

export default function find (name) {
  let handler
  mapping.some((ds) => {
    handler = ds && ds[name]
    return !!handler
  })
  return handler
}
