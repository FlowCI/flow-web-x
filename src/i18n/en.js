export default {
  welcome: 'Welcome to flow.ci',
  create_default_admin: 'Please create a default admin user',
  wait_connection: 'connect to server ',

  back: 'Back',
  save: 'Save',
  reset: 'Reset',
  close: 'Close',
  next: 'Next',
  cancel: 'Cancel',
  skip: 'Skip',
  create: 'Create',
  test: 'Test',
  delete: 'Delete',
  disable: 'Disable',
  enable: 'Enable',
  login: 'Login',
  password: 'Password',
  password_confirm: 'Confirm Password',
  confirm: 'Confirm',
  restart: 'Restart',
  revoke: 'Revoke',
  branch: 'Branch',
  new: 'New',
  edit: 'Edit',

  createAdmin: {
    created: 'The default admin user is created, please login with email {0}'
  },

  menu: {
    signedInAs: 'Signed in as ',
    settings: 'Settings',
    logout: 'Logout',
    help: 'Get help',
    issue: 'Submit issue',
    doc: 'Document'
  },

  flow: {
    name: 'flow',
    create: 'Create Flow',
    search: 'Search by key words',
    settings: 'Settings',
    statistic: 'Statistic',
    config_yml: 'YML Config',

    cron_task: 'Cron Task',
    flow_name: 'Flow name',
    git_yaml: 'Is load YAML from Git (.flowci.yaml)',

    create_title_name: 'Enter Flow Name',
    create_title_select_template: 'Select YAML Template',
    create_title_git_url: 'Config Git URL',
    create_title_git_access: 'Config Git Access',
    create_title_git_test: 'Test Git Connection',
    create_title_yml: 'Config YML',
    create_btn_finish: 'Finish',
    create_git_hint: 'hint: Git repo url and webhook can be configured afterward',
    create_blank_template: 'blank (updated at Flows -> Settings later)',

    delete_btn: 'Delete This Flow',
    delete_desc: 'Once you delete a repository, there is no going back. Please be certain.',

    var_type: 'Data Type',
    var_name: 'Name',
    var_value: 'Value',

    stats_date_select: 'Select Statistic Date:',
    summary_rate_text: 'Success rate',

    more_template: 'More templates',

    tab: {
      options: 'Options',
      variables: 'Variables',
      yaml: 'YAML',
      notification: 'Notification',
      members: 'Members',
    },

    hint: {
      name_required: 'Flow name is required',
      name_size: 'Flow name must be less than 20 character',
      name_rule: 'Flow name only accept characters of a-z, A-Z, 0-9, _, -',
      name_duplicate: 'Flow name already exists',

      git_skip: 'Setup Git access later',
      git_url_required: 'Git URL is required',
      git_url_format: 'Git URL must be start with https or git@',

      credential_name_required: 'SSH key name is required',

      ssh_create: 'click to create new ssh key',
      ssh_email_title: 'Enter the email to create ssh-rsa',
      ssh_email_required: 'Email is required for create ssh-rsa',
      ssh_key_required: 'SSH key is required',
      ssh_public_format: 'Start with ssh-rsa',
      ssh_private_format: 'Start with -----BEGIN RSA PRIVATE KEY-----',

      delete_title: 'Please type in the name of the flow to confirm',
      delete_confirm_name_not_same: 'The typed in name not the same of the flow',

      stats_invalid_date: 'Invalid statistic date',

      yaml_from_git: 'Current yaml will be loaded from Git repo on branch {0}',

      plugin_docker_run: 'Run from docker',
      plugin_installed: 'Applied'
    }
  },

  job: {
    run: 'Run',
    artifact: 'artifact',
    list_empty_message: 'Click \'RUN\' to start your first build',

    tab: {
      summary: 'Steps',
      context: 'Context',
      yml: 'YAML',
      artifacts: 'Artifacts'
    },

    hint: {
      tty: 'Run bash in current step terminal',
      missing_agent: 'There is NO agents, the job will be started until agent has been created'
    }
  },

  agent: {
    agent: 'Agent',
    host: 'Host',

    list_header: 'Agent Status',
    list_no_data: 'No Agents',

    status: {
      busy: 'busy',
      idle: 'idle',
      offline: 'offline'
    },

    hint: {
      name_required: 'Agent name is required',
      name_size: 'Agent name length should be 2 - 20 characters',
      name_rule: 'Agent name only accept characters of a-z, A-Z, 0-9, _, -',
      tag_required: 'Agent tag is required',
      tag_size: 'Agent tag length between 2 - 5 characters',
      tag_rule: 'Agent tag name only accept characters of a-z, A-Z, 0-9',
    }
  },

  settings: {
    li: {
      profile: 'Profile',
      users: 'Users',
      security: 'Security',
      agent: 'Agents',
      secret: 'Secrets',
      config: 'Config',
      system: 'System'
    },

    profile: {
      password_not_empty: 'Password is required',
      password_not_same: 'Incorrect confirm password'
    },

    hint: {
      agent_disabled: 'Hint: The host is disabled'
    }
  },

  credential: {
    hint: {
      name_required: 'Secret name is required',
      name_size: 'Secret name length should be 2 - 20 characters',
      name_rule: 'Secret name only accept characters of a-z, A-Z, 0-9, _, -',

      auth_required: 'Value is required',
      auth_length: 'length should be 1 - 100 characters',
    }
  }
}
