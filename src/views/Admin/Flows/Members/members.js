import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/member'

import Checkbox from 'components/Form/Checkbox'
import Button from 'components/Button'

import classes from './members.scss'

const membersSelector = createSelector(
  (members) => members.get('list'),
  (members) => members.get('data'),
  (ids, data) => ids.toList().map((id) => data.get(id))
)

function mapStateToProps (state, props) {
  const { member } = state

  return {
    members: membersSelector(member)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryMembers: actions.query,
  }, dispatch)
}

export class AdminFlowMembers extends Component {
  static propTypes = {
    flowName: string.isRequired,
    members: list.isRequired,

    queryMembers: func.isRequired,
    i18n: func.isRequired,
  }

  state = {}

  componentDidMount () {
    const { queryMembers } = this.props
    queryMembers()
  }

  componentWillReceiveProps (nextProps) {
    const { flowName } = this.props
    const { flowName: nextFlowName } = nextProps
    if (flowName !== nextFlowName) {
      // reset select
    }
  }

  handleSave = () => {

  }

  render () {
    const { members, i18n } = this.props
    return <div>
      hello world
      <ul className={classes.members}>
        {members.map((member) => {
          const username = member.get('username')
          return <li key={username}>
            <Checkbox />
            {username}
          </li>
        })}
      </ul>
      <Button className='btn-primary'>
        {i18n('保存')}
      </Button>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryMembers'] })(AdminFlowMembers)
)
