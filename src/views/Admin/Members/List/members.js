import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/member'

import Loading from 'components/Loading'
import Input from 'components/Form/Input'
import Checkbox from 'components/Form/Checkbox'

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

function mapStateToProps (state, props) {
  const { member } = state
  return {
    loaded: member.getIn(['ui', 'QUERY']) === STATUS.success,
    list: member.get('list'),
    total: member.getIn(['ui', 'total'], 0),
    adminCount: member.getIn(['ui', 'adminCount'], 0),
    page: member.getIn(['ui', 'page'], 0),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    removeAll: actions.removeAll,
    freedAll: actions.freedAll,
  }, dispatch)
}

export class AdminMemberList extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    list: ImmutablePropTypes.iterable.isRequired,
    total: PropTypes.number.isRequired,
    adminCount: PropTypes.number.isRequired,

    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,

    query: PropTypes.func.isRequired,
    removeAll: PropTypes.func.isRequired,
    freedAll: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: 100,
    i18n: createI18n(language).createChild('list'),
  }

  state = {
    checks: {},
    checkAll: false,
  }

  componentDidMount () {
    const { page, pageSize, query } = this.props
    query(page, pageSize)
  }

  componentWillUnmount () {
    const { freedAll } = this.props
    freedAll()
  }

  getAllChecked (checks) {
    const { list } = this.props
    return list.every((k) => !!checks[k])
  }

  setChecked = (email, checked) => {
    const { checks } = this.state
    const nextChecks = { ...checks, [email]: checked }
    this.setState({
      checks: nextChecks,
      checkAll: this.getAllChecked(nextChecks),
    })
  }

  toggleAll = (checked) => {
    const { list } = this.props

    const nextChecks = {}
    list.forEach((k) => {
      nextChecks[k] = checked
    })
    this.setState({ checks: nextChecks, checkAll: checked })
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
    const { total, adminCount } = this.props
    return <div className={classes.toolbar}>
      <TabBars className={classes.toolbars}>
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
          <ListHeadCol>
            <Checkbox checked={checkAll} onChange={this.toggleAll} />
          </ListHeadCol>
          <ListHeadCol>
            {i18n('用户名')}
          </ListHeadCol>
          <ListHeadCol>
            {i18n('电子邮件')}
          </ListHeadCol>
          <ListHeadCol>
            {i18n('Flow 授权')}
          </ListHeadCol>
          <ListHeadCol>
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
    return <div className={classes.container}>
      {loaded && this.renderFilter()}
      {loaded && <ActionBar i18n={i18n} />}
      {loaded ? this.rendrMembers() : this.renderLoading()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'], trigger: 'unique' })(AdminMemberList)
)
