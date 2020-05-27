import Stomp from 'stompjs'
import actions from './actions'
import { LogWrapper } from '@/util/logs'

const url = process.env.VUE_APP_API_URL

// config websocket instance
const wsUrl = url.replace('http', 'ws').replace('https', 'wss')
const socket = new WebSocket(`${wsUrl}/ws`);
const stompClient = Stomp.over(socket)

// remove debug log
stompClient.debug = function () {
}

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

  if (stompClient.connected) {
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

stompClient.connect({}, function () {
  console.log('connected')

  subscribeBeforeConnected.forEach((item) => {
    subscribed[item.topic] = stompClient.subscribe(item.topic, item.callback)
    console.log('subscribe: ' + item.topic)
  })
})

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
    subscribe('/topic/steps/' + jobId, (data) => {
      let message = JSON.parse(data.body)
      let steps = message.body
      store.dispatch(actions.jobs.steps.update, steps)
    })
  },

  // subscribe tasks changes
  tasks(jobId, store) {
    subscribe('/topic/tasks/' + jobId, (data) => {
      let message = JSON.parse(data.body)
      let tasks = message.body
      console.log("------")
      console.log(tasks)
      console.log("------")
      store.dispatch(actions.jobs.steps.updateTasks, tasks)
    })
  },

  // subscribe realtime logging without vuex store since performance
  logs(store) {
    subscribe('/topic/logs', (data) => {
      let logItemStr = data.body
      if (logItemStr < 2) {
        return
      }

      const cmdIdLen = logItemStr.charCodeAt(0)
      const cmdId = logItemStr.substring(2, cmdIdLen + 2)
      const content = logItemStr.substring(cmdIdLen + 3)

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
  },

  hosts(store) {
    subscribe('/topic/hosts', (data) => {
      let message = JSON.parse(data.body)
      let host = message.body
      store.dispatch(actions.hosts.updated, host)
    })
  }
}

export const unsubscribeTopic = {
  gitTest(flowId) {
    unsubscribe('/topic/flows/git/test/' + flowId)
  },

  jobs() {
    unsubscribe('/topic/jobs')
  },

  agents() {
    unsubscribe('/topic/agents')
  },

  steps(jobId) {
    unsubscribe('/topic/steps/' + jobId)
  },

  tasks(jobId) {
    unsubscribe('/topic/tasks/' + jobId)
  },

  logs() {
    unsubscribe('/topic/logs')
  },

  hosts() {
    unsubscribe('/topic/hosts')
  }
}
