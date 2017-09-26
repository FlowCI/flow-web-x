import React, { Component } from 'react'
import { bool, string, func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'

import Loading from 'components/Loading'
import Button from 'components/Button'

import Member from './member'
import classes from './members.scss'

const membersSelector = createSelector(
  (members) => members.get('list'),
  (members) => members.get('data'),
  (ids, data) => ids.toList().map((id) => data.get(id))
)

function mapStateToProps (state, props) {
  const { member } = state

  return {
    members: membersSelector(member),
    loaded: member.getIn(['ui', 'QUERY']) === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryMembers: actions.query,
    updateFlowAuth: actions.updateFlowAuth,
  }, dispatch)
}

export class AdminFlowMembers extends Component {
  static propTypes = {
    loaded: bool.isRequired,
    flowName: string.isRequired,
    members: list.isRequired,

    queryMembers: func.isRequired,
    updateFlowAuth: func.isRequired,
    i18n: func.isRequired,
  }

  state = {
    selected: this.getInitSelected()
  }

  componentDidMount () {
    const { loaded, queryMembers } = this.props
    !loaded && queryMembers()
  }

  componentWillReceiveProps (nextProps) {
    const { flowName } = this.props
    const { flowName: nextFlowName } = nextProps
    if (flowName !== nextFlowName) {
      // reset select
      this.setState({ selected: this.getInitSelected(nextProps) })
    }
  }

  getInitSelected (props = this.props) {
    return {}
  }

  handleSave = () => {
    console.log(this.state.selected)
  }

  handleChecked = (user, checked) => {
    const { selected } = this.state
    const email = user.get('email')
    this.setState({ selected: { ...selected, [email]: checked } })
  }

  render () {
    const { members, loaded, i18n } = this.props
    const { selected } = this.state
    return <div>
      {!loaded && <Loading />}
      {loaded && <ul className={classes.list}>
        {members.map((member) => {
          const n = member.get('username')
          const email = member.get('email')
          return <Member key={n} user={member}
            checked={selected[email]}
            onChange={this.handleChecked} />
        })}
      </ul>}
      {loaded && <Button className='btn-primary'>
        {i18n('保存')}
      </Button>}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryMembers'] })(AdminFlowMembers)
)
