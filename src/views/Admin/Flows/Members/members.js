import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'
import { actions as alertActions } from 'redux/modules/alert'

import DocumentTitle from 'react-document-title'

import Loading from 'components/Loading'
import Button from 'components/Buttonx'
import CheckboxGroup from 'rc-components/CheckboxGroup'
import Checkbox from 'rc-components/Checkbox'

import classes from './members.scss'

const membersSelector = createSelector(
  (members) => members.get('list'),
  (members) => members.get('data'),
  (ids, data) => ids.toList().map((id) => data.get(id))
)

function mapStateToProps (state, props) {
  const { member, permission } = state

  return {
    members: membersSelector(member),
    loaded: member.getIn(['ui', 'QUERY']) === STATUS.success,
    permission,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryMembers: actions.query,
    updateFlowAuth: actions.updateFlowAuth,
    alert: alertActions.alert,
  }, dispatch)
}

export class AdminFlowMembers extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    flowName: PropTypes.string.isRequired,
    members: ImmutablePropTypes.list.isRequired,
    permission: ImmutablePropTypes.map.isRequired,

    queryMembers: PropTypes.func.isRequired,
    updateFlowAuth: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    /**
     * selected {array} [emails]
     */
    selected: this.getInitSelected()
  }

  componentDidMount () {
    const { loaded, queryMembers } = this.props
    !loaded && queryMembers()
  }

  componentWillReceiveProps (nextProps) {
    const { flowName, permission: p } = this.props
    const { flowName: nextFlowName, permission: np } = nextProps
    if (flowName !== nextFlowName || p !== np) {
      // reset select
      this.setState({ selected: this.getInitSelected(nextProps) })
    }
  }

  getInitSelected (props = this.props) {
    const { flowName, members, permission } = props
    return members.reduce((state, member) => {
      const email = member.get('email')
      const flows = permission.getIn([email, 'flows'])
      if (flows.includes(flowName)) {
        state.push(email)
      }
      return state
    }, [])
  }

  getCheckeds () {
    const { selected } = this.state
    return selected
  }

  handleSave = () => {
    const { updateFlowAuth, flowName, alert, i18n } = this.props
    const checkeds = this.getCheckeds()
    return updateFlowAuth(checkeds, flowName).then(() => {
      alert('success', i18n('更新成功'))
    })
  }

  handleChecked = (values) => {
    this.setState({ selected: values })
  }

  render () {
    const { members, loaded, i18n } = this.props
    const { selected } = this.state
    return <DocumentTitle title='flow 成员管理 · 控制台'>
      <div>
        {!loaded && <Loading />}
        {loaded && <CheckboxGroup className={classes.list}
          value={selected} onChange={this.handleChecked}>
          {members.map((member) => {
            const n = member.get('username')
            const email = member.get('email')
            return <Checkbox key={n} value={email} label={n}
              className={classes.checkbox} />
          })}
        </CheckboxGroup>}
        {loaded && <Button type='primary' onClick={this.handleSave}>
          {i18n('保存')}
        </Button>}
      </div>
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryMembers'] })(AdminFlowMembers)
)
