import React from 'react'
import CreateView, { Thumnail as CreateThumnailView } from './Create'
import ConfigView from './Config'

export default [{
  name: '创建Flow',
  icon: <i className='icon icon-branches' style={{ marginRight: 5 }} />,
  component: CreateView,
  thumnail: CreateThumnailView,
}, {
  name: '配置Git仓库',
  icon: <i className='icon icon-code' />,
  component: ConfigView,
}]
