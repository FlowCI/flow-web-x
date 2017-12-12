import { handleActions } from 'redux-actions'
import { defaultInitState, createHandlers } from 'redux/handler'
import types from './pluginType'

const plugins = [{
  name: 'fir 上传插件',
  enabled: false,
  version: '1.0',
  tags: ['Docker'],
  link: 'https://baidu.com',
  desc: '自动将生成的应用包上传到 fir.im',
}, {
  name: '自定义脚本',
  enabled: true,
  version: '1.2',
  lastest: '2.1',
  tags: ['Jar'],
  link: 'https://baidu.com',
  desc: '编辑自定义脚本，通过脚本实现更多功能',
}, {
  name: '邮件消息插件',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}, {
  name: '邮件消息插件',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}, {
  name: '邮件消息插件2',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}, {
  name: '邮件消息插件3',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}, {
  name: '邮件消息插件4',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}, {
  name: '邮件消息插件5',
  enabled: true,
  version: '2.0',
  lastest: '2.1',
  tags: ['flow-plugin'],
  link: 'https://baidu.com',
  desc: '使用模拟器运行你的单元测试',
}]

const handlers = createHandlers({ id: 'name' })
const initState = handlers.saveAll(defaultInitState, { payload: plugins })

export const actions = {
  query: function () {
    return {
      type: types.query,
    }
  }
}

export default handleActions({

}, initState)
