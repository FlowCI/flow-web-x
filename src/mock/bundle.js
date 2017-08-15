const context = require.context('./database', false, /\.js$/)
const keys = context.keys()

const datas = keys.map((key) => context(key).default)

export default datas
