import types from 'redux/modules/flowType'

export default {
  [types.query]: function () {
    return [{
      'name': 'flow',
      'createdAt': 1502418628,
      'updatedAt': 1502418628
    }, {
      'name': 'flow-a',
      'createdAt': 1502691673,
      'updatedAt': 1502691686
    }, {
      'name': 'flow-test',
      'createdAt': 1502691156,
      'updatedAt': 1502691269
    }]
  },
  [types.get]: function ({ params: { flowName } }) {
    return {
      'name': flowName,
      'createdAt': 1502418628,
      'updatedAt': 1502418628
    }
  },
  [types.create]: function ({ params: { flowName } }) {
    return {
      name: flowName,
      'createdAt': (new Date().getTime()) / 1000,
      'updatedAt': 1502418628
    }
  }
}
