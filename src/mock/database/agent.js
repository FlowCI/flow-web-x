import types from 'redux/modules/agentType'

export default {
  [types.query]: function () {
    return [{
      'name': 'default',
      'zone': 'default',
      'agentStatus': 'IDLE',
      'zoneWithName': 'defaultp - default',
      'flowName': 'xiaomi_ios_dev',
      'number': 2,
      'branch': 'master',
    }, {
      'name': 'fir-machine-1',
      'zone': 'default',
      'agentStatus': 'RUNNING',
      'zoneWithName': 'fir-machine-1 - default',
      'flowName': 'xiaomi_ios_dev',
      'number': 2,
      'branch': 'master',
    }]
  },
}
