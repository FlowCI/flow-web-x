export default {
  list: {
    title: 'Agent',
    filter: {
      ALL: '全部 ( :count )',
      BUSY: '运行中 ( :count )',
      IDLE: '已停止 ( :count )',
      OFFLINE: '已关机 ( :count )',
    },
  },
  create: {
    title: '添加 Agent',
    save: '生成',
    zone: {
      label: 'Zone',
      required: '必填',
    },
    name: {
      label: 'Name',
      required: '必填',
    }
  }
}
