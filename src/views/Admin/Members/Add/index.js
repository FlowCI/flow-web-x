import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/role'

import Form from './form'

const rolesSelector = createSelector(
  (role) => role.get('list'),
  (role) => role.get('data'),
  (list, data) => list.toList().map((id) => data.getIn([id, 'name'])),
)

const flowsSelector = createSelector(
  (flow) => flow.get('list'),
  (flow) => flow.get('data'),
  (list, data) => list.toList().map((id) => data.getIn([id, 'name'])),
)

function mapStateToProps (state, props) {
  const { role, flow } = state
  return {
    loadedRoles: role.getIn(['ui', 'QUERY']) === STATUS.success,
    roles: rolesSelector(role),
    loadedFlows: flow.getIn(['ui', 'QUERY']) === STATUS.success,
    flows: flowsSelector(flow),

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryRoles: actions.query,
  }, dispatch)
}

export class CreateMember extends Component {
  static propTypes = {
    // flows: ImmutablePropTypes.list.isRequired,
    // roles: ImmutablePropTypes.list.isRequired,

    // loadedRoles: PropTypes.bool,
    // loadedFlows: PropTypes.bool,

    queryRoles: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: function (n) { return n },
  }

  componentDidMount () {
    const { queryRoles } = this.props
    queryRoles()
  }

  render () {
    return <Form {...this.props} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryRoles'] })(CreateMember)
)
