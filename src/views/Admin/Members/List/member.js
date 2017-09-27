import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map, List } from 'immutable'

import { connect } from 'react-redux'

import Checkbox from 'components/Form/Checkbox'

import { ListRow, ListCol } from '../../components/List'

function mapStateToProps (state, props) {
  const { member, permission } = state
  const { email } = props

  const m = member.getIn(['data', email], new Map())
  const p = permission.get(email, new Map())

  return {
    member: m,
    roles: p.get('roles', new List()),
    flows: p.get('flows', new List()),
  }
}

export class AdminMemberItem extends Component {
  static propTypes = {
    member: ImmutablePropTypes.map.isRequired,
    roles: ImmutablePropTypes.list,
    flows: ImmutablePropTypes.list,

    email: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    toggle: PropTypes.func.isRequired,
  }

  handleChange = (checked) => {
    const { email, toggle } = this.props
    toggle(email, checked)
  }

  render () {
    const { checked, member, roles, flows } = this.props
    return <ListRow>
      <ListCol>
        <Checkbox checked={checked} onChange={this.handleChange} />
      </ListCol>
      <ListCol>
        {member.get('username')}
      </ListCol>
      <ListCol>
        {member.get('email')}
      </ListCol>
      <ListCol>
        <ul>
          {flows.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </ListCol>
      <ListCol>
        <ul>
          {roles.map((r, i) => <li key={i}>{r.get('name')}</li>)}
        </ul>
      </ListCol>
    </ListRow>
  }
}

export default connect(mapStateToProps)(AdminMemberItem)
