import moment from 'moment'

const JobCategory = {
  MANUAL: '手动构建',
  PUSH: 'Push',
  PR: 'Pull Request',
  TAG: 'Tag'
}

export default {
  buildDuration: function ({ duration }) {
    return `花费 ${duration} 秒`
  },
  buildFromNow: function ({ time }) {
    const t = moment(time * 1000).fromNow()
    return `构建于 ${t}`
  },
  jobCategory: function ({ category }) {
    return JobCategory[category] || '-'
  }
}
