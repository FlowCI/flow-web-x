import types from 'redux/modules/systemType'

export default {
  [types.query]: function () {
    return [{
      info: {},
      name: 'API',
      version: 'alpha-0.1',
      status: 'RUNNING',
      startTime: 1505787968
    }, {
      info: {},
      name: 'Control Center',
      version: 'alpha-0.1',
      status: 'RUNNING',
      startTime: 1505787953
    }]
  },
}
