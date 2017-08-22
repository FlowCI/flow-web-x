const ignore = []
const ignoreReg = new RegExp(`${ignore.join('|')}.js`)

const context = require.context('./database', false, /\.js$/)
let keys = context.keys()
keys = ignore.length ? keys.filter((key) => !ignoreReg.test(key)) : keys

const datas = keys.map((key) => context(key).default)

export default datas
