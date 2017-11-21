import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'
import { actions as roleActions } from 'redux/modules/role'
import { actions as alertActions } from 'redux/modules/alert'

import { push } from 'react-router-redux'

import DocumentTitle from 'react-document-title'

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
    redirect: push,
  }, dispatch)
}

export class CreateMember extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    queryRoles: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('add'),
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
      roles: values.role ? [values.role] : [],
    }
    delete params.flow
    delete params.role

    const { create, redirect } = this.props
    return create(params).then(() => {
      if (this.isMount) {
        const { alert, i18n } = this.props
        alert('success', i18n('创建成功'))
        redirect('/admin/members')
      }
    })
  }

  render () {
    return <DocumentTitle title='添加成员 · 控制台'>
      <Form {...this.props} onSubmit={this.handleSubmit} />
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryRoles'] })(CreateMember)
)
