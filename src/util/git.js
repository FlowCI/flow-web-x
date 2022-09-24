export const GIT_SOURCE_GITLAB = "GITLAB"
export const GIT_SOURCE_GITHUB = "GITHUB"
export const GIT_SOURCE_GOGS = "GOGS"
export const GIT_SOURCE_GITEE = "GITEE"
export const GIT_SOURCE_GERRIT = "GERRIT"

export const GitSourceSelection = [
  {name: 'GitHub', value: GIT_SOURCE_GITHUB, icon: 'mdi-github'},
  {name: 'GitLab', value: GIT_SOURCE_GITLAB, icon: 'mdi-gitlab'},
  // {name: 'Gogs', value: GIT_SOURCE_GOGS, icon: 'mdi-git'},
  // {name: 'Gitee', value: GIT_SOURCE_GITEE, icon: 'mdi-git'},
  {name: 'Gerrit', value: GIT_SOURCE_GERRIT, icon: 'mdi-git'}
]

export const GitSources = {
  [GIT_SOURCE_GITHUB]: {
    name: 'GitHub',
    icon: 'mdi-github'
  },
  [GIT_SOURCE_GITLAB]: {
    name: 'GitLab',
    icon: 'mdi-gitlab'
  },
  [GIT_SOURCE_GOGS]: {
    name: 'Gogs',
    icon: 'mdi-git'
  },
  [GIT_SOURCE_GITEE]: {
    name: 'Gitee',
    icon: 'mdi-git'
  },
  [GIT_SOURCE_GERRIT]: {
    name: 'Gerrit',
    icon: 'mdi-git'
  }
}