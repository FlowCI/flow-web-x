const ignoreFiles = []
const ignoreReg = new RegExp(`^${ignoreFiles.join('|')}.js$`)

const context = require.context('./database', false, /\.js$/)
const keys = context.keys().filter((key) => !ignoreReg.test(key))

const datas = keys.map((key) => context(key).default)

export default datas
