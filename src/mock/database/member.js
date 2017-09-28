import types from 'redux/modules/memberType'
import roleData, { types as roleTypes } from './role'
import flowData, { types as flowTypes } from './flow'

function createRole (key) {
  return {
    name: `mock_role_${key}`
  }
}

function createFlow (key) {
  return `mock_flow_${key}`
}

export default {
  [types.query]: function () {
    const roles = roleData[roleTypes.query]()
    const flows = flowData[flowTypes.query]()

    const randomLength = ~~(Math.random() * 10) + 1
    const users = []

    for (let i = 0; i < randomLength; i++) {
      const role = roles[i % roles.length]
      const fs = flows.filter((flow) => {
        return Math.random() * 10 > 5
      }).map((f) => f.name)
      users.push({
        email:`test${i}@example.com`,
        username: `test${i}`,
        roles: [role],
        flows: fs,
      })
    }

    return {
      total: users.length,
      adminCount: users.filter((user) => user.roles[0].name === 'ADMIN').length,
      users,
    }
  },
  [types.create]: function (params) {
    return {}
  },
  [types.updatePermission]: function ({ params }) {
    const {
      emailList: {
        arrays: emailList,
      },
      roles: {
        arrays = [createRole('1')],
      },
      flowName,
    } = params
    const roles = arrays
    const role = roles[0]
    const flows = flowName ? [flowName] : [createFlow('1')]

    return emailList.map((email) => {
      return {
        email: email,
        username: `demo_for_update_role_username_${email}`,
        flows: flows,
        roles: [{ name: role }]
      }
    })
  },
  [types.removeAll]: function () {
    return {}
  }
}
