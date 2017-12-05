import React from 'react'
import CreateView, { Thumnail as CreateThumnailView } from './Create'
import ConfigView, { Thumnail as ConfigThumnailView } from './Config'
import YmlView from './Yml'

export default [{
  name: '创建 flow',
  icon: <i className='icon icon-branches' style={{ marginRight: 5 }} />,
  component: CreateView,
  thumnail: CreateThumnailView,
}, {
  name: '配置 Git 仓库',
  icon: <i className='icon icon-settings' />,
  component: ConfigView,
  thumnail: ConfigThumnailView,
}, {
  name: '配置 YML 工作流',
  icon: <i className='icon icon-code' />,
  component: YmlView,
}]
