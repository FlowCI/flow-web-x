import types from 'redux/modules/agentType'

export default {
  [types.query]: function () {
    return [{
      'name': 'default',
      'zone': 'default',
      'agentStatus': 'IDLE',
      'zoneWithName': 'defaultp - default'
    }, {
      'name': 'fir-machine-1',
      'zone': 'default',
      'agentStatus': 'BUSY',
      'zoneWithName': 'fir-machine-1 - default'
    }]
  },
}
