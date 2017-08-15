const context = require.context('./', false, /\.js$/)
const keys = context.keys()

const datas = keys.map((key) => context(key).default)

export default function find (name) {
  let handler
  datas.some((ds) => {
    handler = ds[name]
    return !!handler
  })
  return handler
}
