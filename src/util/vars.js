export const VarTypes = [
  'STRING',
  'INT',
  'BOOL',
  'HTTP_URL',
  'GIT_URL',
  'EMAIL'
]

export default {

  app: {
    url: 'FLOWCI_SERVER_URL'
  },

  flow: {
    name: 'FLOWCI_FLOW_NAME',
  },

  job: {
    status: 'FLOWCI_JOB_STATUS',
    trigger: 'FLOWCI_JOB_TRIGGER',
    triggerBy: 'FLOWCI_JOB_TRIGGER_BY',
    build_number: 'FLOWCI_JOB_BUILD_NUM'
  },

  git: {
    url: 'FLOWCI_GIT_URL',
    branch: 'FLOWCI_GIT_BRANCH',
    credential: 'FLOWCI_GIT_CREDENTIAL',

    source: 'FLOWCI_GIT_SOURCE',
    event: 'FLOWCI_GIT_EVENT',
    author: 'FLOWCI_GIT_AUTHOR',
    compare_url: 'FLOWCI_GIT_COMPARE_URL',

    commit: {
      id: 'FLOWCI_GIT_COMMIT_ID',
      message: 'FLOWCI_GIT_COMMIT_MESSAGE',
      time: 'FLOWCI_GIT_COMMIT_TIME',
      url: 'FLOWCI_GIT_COMMIT_URL',
      number: 'FLOWCI_GIT_COMMIT_NUM'
    },

    pr: {
      title: 'FLOWCI_GIT_PR_TITLE',
      message: 'FLOWCI_GIT_PR_MESSAGE',
      url: 'FLOWCI_GIT_PR_URL',
      time: 'FLOWCI_GIT_PR_TIME',
      number: 'FLOWCI_GIT_PR_NUMBER',
      head_repo: 'FLOWCI_GIT_PR_HEAD_REPO_NAME',
      head_branch: 'FLOWCI_GIT_PR_HEAD_REPO_BRANCH',
      head_commit: 'FLOWCI_GIT_PR_HEAD_REPO_COMMIT',
      base_repo: 'FLOWCI_GIT_PR_BASE_REPO_NAME',
      base_branch: 'FLOWCI_GIT_PR_BASE_REPO_BRANCH',
      base_commit: 'FLOWCI_GIT_PR_BASE_REPO_COMMIT'
    }
  }
}
