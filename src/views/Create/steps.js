import CreateView, { Thumnail as CreateThumnailView } from './Create'
import ConfigView from './Config'

export default [{
  name: '创建Flow',
  icon: 'icon-branches',
  component: CreateView,
  thumnail: CreateThumnailView,
}, {
  name: '配置Git仓库',
  icon: 'icon-code',
  component: ConfigView,
}]
