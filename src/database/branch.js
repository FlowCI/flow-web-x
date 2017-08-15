import types from 'redux/modules/branchType'

export default {
  [types.query]: function () {
    return [
      'master',
      'develop',
      'feature/xx',
    ]
  },
}
