export default {
  app: {
    setConnState: 'g/setConnectionState',
    showSnackbar: 'g/show',
    popCreateFlow: 'g/popCreateFlow',
    popCreateGroup: 'g/popCreateGroup'
  },

  auth: {
    load: 'auth/load',
    login: 'auth/login',
    logout: 'auth/logout'
  },

  flowItems: {
    list: 'flowItems/list',
    reset: 'flowItems/reset',
    exist: 'flowItems/exist',
    add: 'flowItems/add'
  },

  flows: {
    create: 'flows/create',
    createSshRsa: 'flows/createSshRsa',
    confirm: 'flows/confirm',
    update: 'flows/update',
    listByCredential: 'flows/listByCredential',
    select: 'flows/select',
    delete: 'flows/delete',
    templates: 'flows/templates',
    users: {
      list: 'flows/listUsers',
      add: 'flows/addUser',
      remove: 'flows/removeUser'
    },
    vars: {
      add: 'flows/addVar',
      remove: 'flows/removeVar'
    },
    yml: {
      load: 'flows/loadYml',
      save: 'flows/saveYml'
    },
    gitTestStart: 'flows/gitTestStart',
    gitTestUpdate: 'flows/gitTestUpdate',
    gitBranches: 'flows/gitBranches'
  },

  jobs: {
    latest: 'jobs/latest',
    start: 'jobs/start',
    create: 'jobs/create',
    rerun: 'jobs/rerun',
    cancel: 'jobs/cancel',
    list: 'jobs/list',
    related: 'jobs/related',
    statusUpdate: 'jobs/statusUpdate',
    select: 'jobs/select',
    getYml: 'jobs/getYml',
    getDesc: 'jobs/getDesc',
    reports: {
      list: 'jobs/listReport',
      fetch: 'jobs/fetchReport'
    },
    artifacts: {
      list: 'jobs/listArtifact',
      download: 'jobs/downloadArtifact'
    },
    steps: {
      get: 'steps/get',
      update: 'steps/update',
    },
    logs: {
      push: 'logs/push',
      load: 'logs/load',
      download: 'logs/download',
      read: 'logs/read'
    },
  },

  agents: {
    get: 'agents/get',
    createOrUpdate: 'agents/createOrUpdate',
    delete: 'agents/delete',
    list: 'agents/list',
    update: 'agents/update',
    select: 'agents/select',
    updateProfile: 'agents/updateProfile'
  },

  secrets: {
    createRsa: 'secrets/createRsa',
    createAuth: 'secrets/createAuth',
    createToken: 'secrets/createToken',
    createAndroidSign: 'secrets/createAndroidSign',
    createKubeConfig: 'secrets/createKubeConfig',
    list: 'secrets/list',
    listNameOnly: 'secrets/listNameOnly',
    get: 'secrets/get',
    delete: 'secrets/delete'
  },

  configs: {
    saveSmtp: 'configs/saveSmtp',
    saveText: 'configs/saveText',
    list: 'configs/list',
    listSmtp: 'configs/listSmtp',
    get: 'configs/get',
    delete: 'configs/delete'
  },

  triggers: {
    saveEmail: 'triggers/saveEmail',
    saveWebhook: 'triggers/saveWebhook',
    list: 'triggers/list',
    get: 'triggers/get',
    delete: 'triggers/delete',
    deliveries: 'triggers/deliveries'
  },

  users: {
    hasDefault: 'users/hasDefault',
    createDefault: 'users/createDefault',

    listAll: 'users/listAll',
    create: 'users/create',
    changePassword: 'users/changePassword',
    changeRole: 'users/changeRole'
  },

  stats: {
    list: 'stats/list',
    total: 'stats/total',
    metaType: 'stats/metaType',
    metaTypeList: 'stats/metaTypeList'
  },

  plugins: {
    list: 'plugins/list',
    notifies: 'plugins/notifies',
    readme: 'plugins/readme',
    icon: 'plugins/icon'
  },

  hosts: {
    get: 'hosts/get',
    list: 'hosts/list',
    createOrUpdate: 'hosts/createOrUpdate',
    switch: 'hosts/switch',
    delete: 'hosts/delete',
    test: 'hosts/test',
    updated: 'hosts/updated'
  },

  tty: {
    connect: 'tty/connect',
    shell: 'tty/shell',
    close: 'tty/close'
  },

  settings: {
    get: 'settings/get',
    save: 'settings/save'
  },

  git: {
    list: 'git/list',
    save: 'git/save',
    delete: 'git/delete'
  }
}
