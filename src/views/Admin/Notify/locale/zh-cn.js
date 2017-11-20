export default {
  title: '邮件设置',
  subTitle: '用于发送邮件，目前只提供 SMTP 模式',

  smtpUrl: {
    label: 'SMTP 服务器',
    placeholder: 'smtp.example.com',

    required: '必填',
    'not host': '请填写正确服务器地址',
  },

  smtpPort: {
    label: 'SMTP 端口',
    placeholder: '',

    required: '必填',
    'not number': '必须是数字',
  },

  sender: {
    label: '发信人邮箱',
    placeholder: 'email@example.com',

    required: '必填',
    'not email': '请填写正确的邮箱',
  },

  username: {
    label: '验证用户名',
    placeholder: '',

    required: '必填',
  },

  password: {
    label: '验证密码',
    placeholder: '',

    required: '必填',
  },

  test: '测试发送',
  save: '保存',
}
