import Stomp from 'stompjs'
import actions from './actions'
import { LogWrapper } from '@/util/logs'

let stompClient // init from connect function
let intervalId

const url = process.env.VUE_APP_API_URL

// event type from server
const events = {
  create: 'NEW_CREATED',
  change: 'STATUS_CHANGE'
}

// subscribe topic and callback method before connect
const subscribeBeforeConnected = []

// to record subscribed topic
const subscribed = {}

// subscribe topic
function subscribe(topic, callback) {
  if (subscribed[topic]) {
    return
  }

  if (stompClient && stompClient.connected) {
    subscribed[topic] = stompClient.subscribe(topic, callback)
    console.log('subscribe: ' + topic)
    return
  }

  subscribeBeforeConnected.push({topic: topic, callback: callback})
}

// unsubscribe topic
function unsubscribe(topic) {
  const subscribedInfo = subscribed[topic]

  if (subscribedInfo) {
    subscribedInfo.unsubscribe()
    delete subscribed[topic]
  }
}

export function connect(store) {
  let wsUrl = url.replace('http', 'ws').replace('https', 'wss')
  stompClient = Stomp.client(`${wsUrl}/ws`)
  stompClient.reconnect_delay = 5000
  stompClient.debug = function () {
  }

  let onConnected = () => {
    console.log('connected')

    subscribeBeforeConnected.forEach((item) => {
      subscribed[item.topic] = stompClient.subscribe(item.topic, item.callback)
      console.log('subscribe: ' + item.topic)
    })

    store.commit(actions.app.setConnState, true)
  }

  let onError = (e) => {
    console.log(e)
    console.log('reconnect in 10 seconds')
    store.commit(actions.app.setConnState, false)

    setTimeout(() => {
      connect(store)
    }, 1000 * 10);
  }

  stompClient.connect({}, onConnected, onError)
}

export const ws = {
  token: process.env.VUE_APP_TOKEN,
  setToken(t) {
    this.token = t
  }
}

export function send(topic, body) {
  stompClient.send(topic, {Token: ws.token}, body)
}

export const subscribeTopic = {
  // subscribe flow git test
  gitTest(store, flowId) {
    subscribe('/topic/flows/git/test/' + flowId, (data) => {
      let message = JSON.parse(data.body)
      store.dispatch(actions.flows.gitTestUpdate, message.body).then()
    })
  },

  // subscribe job changes
  jobs(store) {
    subscribe('/topic/jobs', (data) => {
      let message = JSON.parse(data.body)

      // job created
      if (events.create === message.event) {
        store.dispatch(actions.jobs.create, message.body).then()
        return
      }

      // job status changed
      if (events.change === message.event) {
        store.dispatch(actions.jobs.statusUpdate, message.body).then()
      }
    })
  },

  // subscribe step changes
  steps(jobId, store) {
    subscribe(`/topic/steps/${jobId}`, (data) => {
      let message = JSON.parse(data.body)
      let steps = message.body
      store.dispatch(actions.jobs.steps.update, steps)
    })
  },

  // subscribe realtime logging without vuex store since performance
  logs(jobId, store) {
    subscribe(`/topic/logs/${jobId}`, (data) => {
      const message = JSON.parse(data.body)
      const cmdId = message.id
      const content = atob(message.content)
      store.dispatch(actions.jobs.logs.push, new LogWrapper(cmdId, content))
    })
  },

  // subscribe agent update
  agents(store) {
    subscribe('/topic/agents', (data) => {
      let message = JSON.parse(data.body)
      let agent = message.body
      store.dispatch(actions.agents.update, agent)
    })

    subscribe('/topic/agent_profile', (data) => {
      let message = JSON.parse(data.body)
      let profile = message.body
      store.dispatch(actions.agents.updateProfile, profile)
    })
  },

  hosts(store) {
    subscribe('/topic/hosts', (data) => {
      let message = JSON.parse(data.body)
      let host = message.body
      store.dispatch(actions.hosts.updated, host)
    })
  },

  tty(jobId, onCmdCallback, onLogCallback, onErrorCallback) {
    subscribe(`/topic/tty/action/${jobId}`, (data) => {
      let message = JSON.parse(data.body)
      onCmdCallback(message.body) // TtyCmd.Out
    })

    subscribe(`/topic/tty/logs/${jobId}`, (data) => {
      onLogCallback(atob(data.body))
    })
  }
}

export const unsubscribeTopic = {
  gitTest(flowId) {
    unsubscribe(`/topic/flows/git/test/${flowId}`)
  },

  jobs() {
    unsubscribe('/topic/jobs')
    unsubscribe('/topic/agent_profile')
  },

  agents() {
    unsubscribe('/topic/agents')
  },

  steps(jobId) {
    unsubscribe(`/topic/steps/${jobId}`)
  },

  logs(jobId) {
    unsubscribe(`/topic/logs/${jobId}`)
  },

  hosts() {
    unsubscribe('/topic/hosts')
  },

  tty(jobId) {
    unsubscribe(`/topic/tty/action/${jobId}`)
    unsubscribe(`/topic/tty/logs/${jobId}`)
  }
}
