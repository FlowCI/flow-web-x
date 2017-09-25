import types from 'redux/modules/memberType'
import roleData, { types as roleTypes } from './role'
import flowData, { types as flowTypes } from './flow'

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
  [types.updateRoles]: function ({ params }) {
    const { emailList, roles } = params
    const role = roles[0]

    return emailList.map((email) => {
      return {
        email: email,
        username: `demo_for_update_role_username_${email}`,
        flows: [`demo_flow_name_for_${email}`],
        roles: [{ name: role }]
      }
    })
  },
  [types.removeAll]: function () {
    return {}
  }
}
