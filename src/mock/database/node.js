import types from 'redux/modules/nodeType'
export default {
  [types.getLog]: function ({ params: { flowName, jobNumber, nodeOrder } }) {
    return 'this is an log'
  }
}
