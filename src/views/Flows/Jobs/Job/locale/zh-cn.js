import moment from 'moment'

export default {
  buildDuration: function ({ duration }) {
    return `花费 ${duration} 秒`
  },
  buildFromNow: function ({ time }) {
    const t = moment(time * 1000).fromNow()
    return `构建于 ${t}`
  },
  commit: '提交 ID',
  author: '作者',
  branch: '分支',
  'commit message': '提交说明',
  compare: '变更对比',
}
