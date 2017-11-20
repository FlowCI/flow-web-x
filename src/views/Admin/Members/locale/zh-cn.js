export default {
  list: {
    title: '成员列表',
    filter: {
      ALL: '全部 (:count)',
      ADMIN: '管理员 (:count)',
    }
  },
  add: {
    title: '添加成员',
    save: '添加成员',
    username: {
      label: '*用户名',
      placeholder: '用户名（推荐使用员工姓名拼音）',
      required: '必填',
    },
    email: {
      label: '*邮箱',
      placeholder: '',
      required: '必填',
      'not email': '请填写正确的邮箱',
    },
    password: {
      label: '*初始密码',
      placeholder: '',
      required: '必填',
    },
    role: {
      label: '角色',
      placeholder: '选择角色',
      required: '必填',
    },
    flow: {
      label: 'Flow 授权',
      placeholder: '',
      required: '必填',
    },
    isSendEmail: {
      label: '发送用户通知',
      desc: '向新成员发送有关账户详情的电子邮件',
    },
  },
}
