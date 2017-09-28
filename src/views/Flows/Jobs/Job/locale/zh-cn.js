import moment from 'moment'

export default {
  buildDuration: function ({ duration }) {
    return `花费 ${duration} 秒`
  },
  buildFromNow: function ({ time }) {
    const t = moment(time * 1000).fromNow()
    return `构建于 ${t}`
  },
}
