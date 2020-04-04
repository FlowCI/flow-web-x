import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import actions from './actions'
import { LogWrapper } from '../util/logs'

const url = process.env.VUE_APP_API_URL

// config websocket instance
const socket = new SockJS(`${url}/ws`)
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
function subscribe (topic, callback) {
  if (subscribed[ topic ]) {
    return
  }

  if (stompClient.connected) {
    subscribed[ topic ] = stompClient.subscribe(topic, callback)
    console.log('subscribe: ' + topic)
    return
  }

  subscribeBeforeConnected.push({topic: topic, callback: callback})
}

// unsubscribe topic
function unsubscribe (topic) {
  const subscribedInfo = subscribed[ topic ]

  if (subscribedInfo) {
    subscribedInfo.unsubscribe()
    delete subscribed[ topic ]
  }
}

stompClient.connect({}, function () {
  console.log('connected')

  subscribeBeforeConnected.forEach((item) => {
    subscribed[ item.topic ] = stompClient.subscribe(item.topic, item.callback)
    console.log('subscribe: ' + item.topic)
  })
})

export const subscribeTopic = {
  // subscribe flow git test
  gitTest (store, flowId) {
    subscribe('/topic/flows/git/test/' + flowId, (data) => {
      let message = JSON.parse(data.body)
      store.dispatch(actions.flows.gitTestUpdate, message.body).then()
    })
  },

  // subscribe job changes
  jobs (store) {
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
  steps (jobId, store) {
    subscribe('/topic/steps/' + jobId, (data) => {
      let message = JSON.parse(data.body)
      let steps = message.body
      store.dispatch(actions.jobs.steps.update, steps)
    })
  },

  // subscribe realtime logging without vuex store since performance
  logs (cmdId, callback) {
    subscribe('/topic/logs/' + cmdId, (data) => {
      let message = atob(data.body);

      const wrapper = new LogWrapper(cmdId, message)
      callback(wrapper)
    })
  },

  // subscribe agent update
  agents (store) {
    subscribe('/topic/agents', (data) => {
      let message = JSON.parse(data.body)
      let agent = message.body
      store.dispatch(actions.agents.update, agent)
    })
  },

  hosts (store) {
    subscribe('/topic/hosts', (data) => {
      let message = JSON.parse(data.body)
      let host = message.body
      store.dispatch(actions.hosts.updated, host)
    })
  }
}

export const unsubscribeTopic = {
  gitTest (flowId) {
    unsubscribe('/topic/flows/git/test/' + flowId)
  },

  steps (jobId) {
    unsubscribe('/topic/steps/' + jobId)
  },

  logs (cmdId) {
    unsubscribe('/topic/logs/' + cmdId)
  },

  hosts () {
    unsubscribe('/topic/hosts')
  }
}
