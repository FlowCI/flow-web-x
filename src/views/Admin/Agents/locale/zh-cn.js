export default {
  document: {
    index: 'Agent · 控制台',
    create: '添加 Agent · 控制台',
  },
  navbar: {
    index: 'Agent',
    create: '添加 Agent',
  },
  list: {
    toolbar: {
      ALL: '全部 ( :count )',
      BUSY: '运行中 ( :count )',
      IDLE: '已停止 ( :count )',
      OFFLINE: '已关机 ( :count )',
    },
    removeConfirm: '确认删除 :name ?',
    status: '运行状态',
    agent: 'Agent',
    build: '任务',
    token: 'Token',
    actions: '操作',

    'stop build': '停止任务',
    'shut down': '停止',
    'see more': '查看',
    'delete': '删除',
  },
  create: {
    save: '生成',
    zone: {
      label: 'Zone',
      placeholder: '',
    },
    name: {
      label: 'Name',
      placeholder: '',
    }
  },
  configDialog: {
    title: '环境信息',
    key: '名称',
    value: '值'
  }
}
