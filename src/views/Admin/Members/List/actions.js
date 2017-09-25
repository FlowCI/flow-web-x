import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/role'

import Button from 'components/Button'
import { Select, Option } from 'components/Form/Select'

import classes from './members.scss'

const rolesSelector = createSelector(
  (role) => role.get('list'),
  (role) => role.get('data'),
  (list, data) => list.toList().map((id) => data.get(id)),
)
function mapStateToProps (state, props) {
  const { role } = state
  return {
    roles: rolesSelector(role),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    freedAll: actions.freedAll,
  }, dispatch)
}

export class AdminMemberListActions extends Component {
  static propTypes = {
    roles: ImmutablePropTypes.list.isRequired,

    onRemove: PropTypes.func,
    onChangRole: PropTypes.func,

    query: PropTypes.func.isRequired,
    freedAll: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {}

  componentDidMount () {
    const { query } = this.props
    query()
  }

  componentWillUnmount () {
    const { freedAll } = this.props
    freedAll()
  }

  handleRoleSelect = (v) => {
    this.setState({ role: v })
  }

  handleRole = () => {
    const { role } = this.state
    const { onChangRole } = this.props
    return onChangRole && onChangRole(role)
  }

  renderRoles () {
    const { roles, i18n } = this.props
    const { role } = this.state
    return <Select placeholder={i18n('选择变更角色')} value={role}
      onChange={this.handleRoleSelect}>
      {roles.map((r) => <Option key={r.get('id')}
        value={r.get('id')} title={r.get('name')} />)}
    </Select>
  }

  render () {
    const { i18n, onRemove } = this.props
    return <div className={classes.container}>
      <Button className='btn-default' onClick={onRemove}>
        {i18n('删除')}
      </Button>
      {this.renderRoles()}
      <Button className='btn-default' onClick={this.handleRole}>
        {i18n('应用')}
      </Button>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminMemberListActions)
)
