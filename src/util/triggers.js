export const CATEGORY_EMAIL = 'Email'
export const CATEGORY_WEBHOOK = 'WebHook'

export const TRIGGER_ON_JOB_FINISHED = "OnJobFinished"
export const TRIGGER_ON_AGENT_STATUS_CHANGE = "OnAgentStatusChange"
export const TRIGGER_ON_USER_CREATED = "OnUserCreated"
export const TRIGGER_ON_USER_ADDED_TO_FLOW = "OnUserAddedToFlow"

export const TO_ALL_FLOW_USERS = "FLOW_USERS"

export const CategorySelection = [
  {name: 'Email', value: CATEGORY_EMAIL, icon: 'mdi-email-outline'},
  {name: 'WebHook', value: CATEGORY_WEBHOOK, icon: 'mdi-webhook'},
]

export const Categories = {
  [CATEGORY_EMAIL]: {
    name: 'Email',
    icon: 'mdi-email-outline'
  },
  [CATEGORY_WEBHOOK]: {
    name: 'WebHook',
    icon: 'mdi-webhook'
  }
}

export const ActionSelection = [
  {name: 'On Job Finished', value: TRIGGER_ON_JOB_FINISHED, icon: ''}
]