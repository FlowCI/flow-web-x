export default {
  title: '邮件设置',
  subTitle: '用于发送邮件，目前只提供 SMTP 模式',

  smtpUrl: {
    label: 'SMTP 服务器',
    placeholder: 'smtp.example.com',
  },

  smtpPort: {
    label: 'SMTP 端口',
    placeholder: '',
  },

  sender: {
    label: '发信人邮箱',
    placeholder: 'email@example.com',
  },

  username: {
    label: '验证用户名',
    placeholder: '',
  },

  password: {
    label: '验证密码',
    placeholder: '',
  },

  test: '测试发送',
  save: '保存',
}
