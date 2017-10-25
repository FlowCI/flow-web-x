import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'
import { actions as alertActions } from 'redux/modules/alert'

import Loading from 'components/Loading'
import Input from 'components/Form/Input'
import Checkbox from 'components/Form/Checkbox'
import { Confirm } from 'components/Modal'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
} from '../../components/List'
import {
  TabBars,
  Tab
} from '../../components/TabBars'
import Member from './member'
import ActionBar from './actions'

import classes from './members.scss'

const includeIdsSelector = createSelector(
  (member, permission, roleStr) => {
    return member.get('list')
  },
  (member, permission, roleStr) => {
    return member.get('data')
  },
  (member, permission, roleStr) => {
    return permission
  },
  (member, permission, roleStr) => {
    return roleStr
  },
  (list, data, mapping, roleStr) => {
    return list.filter((id) => {
      const m = data.get(id)
      const email = m.get('email')
      const roles = mapping.getIn([email, 'roles'])
      return roles && roles.some((r) => r.get('name') === roleStr)
    })
  }
)

function mapStateToProps (state, props) {
  const { member, session, permission } = state
  const cate = member.getIn(['ui', 'filter', 'category'], 'ALL')
  return {
    loaded: member.getIn(['ui', 'QUERY']) === STATUS.success,
    currentEmail: session.getIn(['user', 'email']),
    list: cate === 'ALL' ? member.get('list')
      : includeIdsSelector(member, permission, cate),
    total: member.getIn(['ui', 'total'], 0),
    adminCount: member.getIn(['ui', 'adminCount'], 0),
    page: member.getIn(['ui', 'page'], 0),
    category: cate,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    setFilter: actions.setFilter,
    updateRole: actions.updateRole,
    removeAll: actions.removeAll,
    freedAll: actions.freedAll,

    alert: alertActions.alert,
  }, dispatch)
}

export class AdminMemberList extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    currentEmail: PropTypes.string.isRequired,
    list: ImmutablePropTypes.iterable.isRequired,
    total: PropTypes.number.isRequired,
    adminCount: PropTypes.number.isRequired,

    category: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,

    alert: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
    updateRole: PropTypes.func.isRequired,
    removeAll: PropTypes.func.isRequired,
    freedAll: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: 100,
    i18n: createI18n(language).createChild('list'),
  }

  state = {
    type: 'ALL',
    checks: {},
    checkAll: false,
    confirm: false,
  }

  componentDidMount () {
    const { page, pageSize, query } = this.props
    query(page, pageSize)
  }

  componentWillUnmount () {
    const { freedAll } = this.props
    freedAll()
  }

  isAllChecked (checks) {
    const { list } = this.props
    return list.every((k) => !!checks[k])
  }

  getChecked () {
    const { checks } = this.state
    const { list } = this.props
    const keys = Object.keys(checks)
    return keys.filter((k) => !!checks[k] && list.has(k))
  }

  setChecked = (email, checked) => {
    const { checks } = this.state
    const nextChecks = { ...checks, [email]: checked }
    this.setState({
      checks: nextChecks,
      checkAll: this.isAllChecked(nextChecks),
    })
  }

  setListType = (type) => {
    this.setState({
      checks: {},
      checkAll: false,
      confirm: false,
    })
    this.props.setFilter({ category: type })
  }

  toggleAll = (checked) => {
    const { list } = this.props

    const nextChecks = {}
    list.forEach((k) => {
      nextChecks[k] = checked
    })
    this.setState({ checks: nextChecks, checkAll: checked })
  }

  handleRemove = () => {
    this.closeRemoveConfirm()
    const { removeAll, alert, currentEmail } = this.props
    const selected = this.getChecked()
      .filter((email) => email !== currentEmail)
    if (selected.length) {
      this.setState({ checks: {}, checkAll: false })
      return removeAll(selected).then(() => {
        alert('success', '删除成功')
      })
    }
  }

  handleChangeRole = (role) => {
    const { updateRole, alert } = this.props
    const selected = this.getChecked()
    if (selected.length) {
      this.setState({ checks: {}, checkAll: false })
      return updateRole(selected, role).then(() => {
        alert('success', '更新角色成功')
      })
    }
  }

  openRemoveConfirm = () => {
    this.setState({ confirm: true })
  }

  closeRemoveConfirm = () => {
    this.setState({ confirm: false })
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  renderFilterItem (category, count) {
    const { i18n } = this.props
    const text = i18n(`filter.${category}`, { count })
    return <Tab value={category} text={text} />
  }

  renderFilter () {
    const { total, adminCount, category } = this.props
    return <div className={classes.toolbar}>
      <TabBars className={classes.toolbars}
        value={category} onChange={this.setListType}>
        {this.renderFilterItem('ALL', total)}
        {this.renderFilterItem('ADMIN', adminCount)}
      </TabBars>
      <Input className={classes.search} placeholder='搜索'
        leftIcon={<i className='icon icon-search2' />}
      />
    </div>
  }

  rendrMembers () {
    const { i18n, list } = this.props
    const { checks, checkAll } = this.state
    return <List className={classes.agents}>
      <ListHead>
        <ListRow>
          <ListHeadCol className={classes.checkbox}>
            <Checkbox checked={checkAll} onChange={this.toggleAll} />
          </ListHeadCol>
          <ListHeadCol className={classes.username}>
            {i18n('用户名')}
          </ListHeadCol>
          <ListHeadCol className={classes.email}>
            {i18n('电子邮件')}
          </ListHeadCol>
          <ListHeadCol className={classes.flows}>
            {i18n('Flow 授权')}
          </ListHeadCol>
          <ListHeadCol className={classes.roles}>
            {i18n('角色')}
          </ListHeadCol>
        </ListRow>
      </ListHead>
      <ListBody>
        {list.map((email) => <Member key={email} email={email}
          checked={checks[email]} toggle={this.setChecked} />)}
      </ListBody>
    </List>
  }

  render () {
    const { loaded, i18n } = this.props
    const { confirm } = this.state
    return <div className={classes.container}>
      {loaded && this.renderFilter()}
      {loaded && <ActionBar i18n={i18n}
        onRemove={this.openRemoveConfirm}
        onChangRole={this.handleChangeRole}
      />}
      {loaded ? this.rendrMembers() : this.renderLoading()}
      <Confirm title='删除提示' isOpen={confirm}
        onOk={this.handleRemove} onCancel={this.closeRemoveConfirm} />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'], trigger: 'unique' })(AdminMemberList)
)
