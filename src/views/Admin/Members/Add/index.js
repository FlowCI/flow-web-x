import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'
import { actions as roleActions } from 'redux/modules/role'
import { actions as alertActions } from 'redux/modules/alert'

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
    create: actions.create,
    queryRoles: roleActions.query,
    alert: alertActions.alert,
  }, dispatch)
}

export class CreateMember extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    queryRoles: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: function (n) { return n },
  }

  componentDidMount () {
    const { queryRoles } = this.props
    queryRoles()
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  handleSubmit = (values) => {
    const params = {
      ...values,
      flows: values.flow === false ? [] : [values.flow],
      roles: [values.role],
    }
    delete params.flow
    delete params.role

    const { create } = this.props
    return create(params).then(() => {
      if (this.isMount) {
        const { alert, i18n } = this.props
        alert('success', i18n('创建成功'))
        // maybe redirect to list
      }
    })
  }

  render () {
    return <Form {...this.props} onSubmit={this.handleSubmit} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryRoles'] })(CreateMember)
)
