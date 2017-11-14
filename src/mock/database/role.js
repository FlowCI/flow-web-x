import types from 'redux/modules/roleType'

export {
  types
}
export default {
  [types.query]: function () {
    return [{
      id: 1,
      name: 'ADMIN'
    }, {
      id: 2,
      name: 'DEVELOPER'
    }]
  }
}
