export const CATEGORY_EMAIL = 'Email'
export const CATEGORY_WEBHOOK = 'WebHook'

export const EVENT_ON_JOB_FINISHED = "OnJobFinished"
export const EVENT_ON_AGENT_STATUS_CHANGE = "OnAgentStatusChange"
export const EVENT_ON_USER_CREATED = "OnUserCreated"
export const EVENT_ON_USER_ADDED_TO_FLOW = "OnUserAddedToFlow"

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

export const EventSelection = [
  {name: 'On Job Finished', value: EVENT_ON_JOB_FINISHED, icon: ''}
]

export const WebhookHelper = {
  NewKvItem() {
    return {key: '', value: '', keyError: false, valueError: false, showAddBtn: true}
  },

  SetParamsAndHeaderFromKvItems(obj) {
    const convertKvItemToMap = (items) => {
      const map = {}
      for (const item of items) {
        if (item.key === '') {
          continue
        }
        map[item.key] = item.value
      }
      return map
    }

    obj.params = convertKvItemToMap(obj.paramItems)
    obj.headers = convertKvItemToMap(obj.headerItems)
  },

  SetKvItemsFromParamsAndHeader(obj) {
    const convertMapToKvItems = (map) => {
      const items = []
      for (const [key, value] of Object.entries(map)) {
        items.push({key: key, value: value, keyError: false, valueError: false, showAddBtn: false})
      }

      items.push(this.NewKvItem())
      return items
    }

    if (!obj.params) {
      obj.params = {}
    }

    if (!obj.headers) {
      obj.headers = {}
    }

    obj.paramItems = convertMapToKvItems(obj.params)
    obj.headerItems = convertMapToKvItems(obj.headers)
  }
}

export function NewEmptyObj() {
  const obj = {
    name: '',
    category: CATEGORY_EMAIL,
    event: EVENT_ON_JOB_FINISHED,
    // email properties
    from: '',
    to: '',
    subject: '',
    smtpConfig: '',
    // webhook properties
    url: '',
    httpMethod: 'GET',
    params: {},
    headers: {},
    body: ''
  }

  WebhookHelper.SetKvItemsFromParamsAndHeader(obj)
  return obj
}
