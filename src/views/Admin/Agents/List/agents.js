import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import i18n from '../i18n'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { isSuccess } from 'redux-http'

import { actions } from 'redux/modules/agent'
import { actions as jobActions } from 'redux/modules/job'
import { actions as alertActions } from 'redux/modules/alert'

import Loading from 'components/Loading'
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

import ConfigDialog from '../components/ConfigDialog'
import Agent from './agent'
import classes from './agents.scss'

function mapStateToProps (state, props) {
  const { agent } = state
  return {
    agents: agent.get('list'),
    loading: !isSuccess(agent.getIn(['ui', 'QUERY'])),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    stop: jobActions.stop,
    query: actions.query,
    close: actions.close,
    remove: actions.remove,
    alert: alertActions.alert,
  }, dispatch)
}

export class AdminAgentView extends Component {
  static propTypes = {
    agents: ImmutablePropTypes.list.isRequired,
    loading: PropTypes.bool,

    query: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: i18n.createChild('list'),
  }

  state = {
    category: 'ALL',
    openConfirm: false,
    openConfig: false,
  }

  componentDidMount () {
    const { query } = this.props
    query()
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  selectCategory = (category) => {
    this.setState({ category })
  }

  getAgents () {
    const { agents } = this.props
    const { category } = this.state
    return category === 'ALL' ? agents : agents.filter((agent) =>
      agent.get('agentStatus') === category)
  }

  openConfirm = (agent) => {
    if (this.isMount) {
      this.setState({ selected: agent, openConfirm: true })
    }
  }

  closeConfirm = () => {
    if (this.isMount) {
      this.setState({ openConfirm: false, selected: undefined })
    }
  }

  openConfig = (agent) => {
    if (this.isMount) {
      this.setState({ selected: agent, openConfig: true })
    }
  }

  closeConfig = () => {
    if (this.isMount) {
      this.setState({ openConfig: false, selected: undefined })
    }
  }

  handleRemove = () => {
    const { selected } = this.state
    const { remove, alert } = this.props
    return remove(selected)
      .then(this.closeConfirm, this.closeConfirm)
      .then(() => {
        alert('success', '删除成功')
      })
  }

  renderAgent = (agent) => {
    const { stop, close } = this.props
    return <Agent key={agent.get('id')} agent={agent}
      stop={stop} close={close} remove={this.openConfirm}
      openDetail={this.openConfig}
    />
  }

  renderAgents () {
    const { i18n } = this.props
    const agents = this.getAgents()
    return <div className={classes.scroller}>
      <List className={classes.agents}>
        <ListHead>
          <ListRow>
            <ListHeadCol className={classes.status}>
              {i18n('运行状态')}
            </ListHeadCol>
            <ListHeadCol className={classes.name}>
              {i18n('Agent')}
            </ListHeadCol>
            <ListHeadCol className={classes.job}>
              {i18n('任务')}
            </ListHeadCol>
            <ListHeadCol className={classes.token}>
              {i18n('Token')}
            </ListHeadCol>
            <ListHeadCol className={classes.actions}>
              {i18n('操作')}
            </ListHeadCol>
          </ListRow>
        </ListHead>
        <ListBody>
          {agents.map(this.renderAgent)}
        </ListBody>
      </List>
    </div>
  }

  renderFilterItem (category, cate) {
    const { i18n } = this.props
    const text = i18n(`filter.${category}`, { count: cate[category] })
    return <Tab value={category} text={text} />
  }

  renderFilter () {
    const { agents } = this.props
    const { category } = this.state
    const cate = agents.reduce((cat, agent) => {
      switch (agent.get('agentStatus')) {
        case 'BUSY':
          cat.BUSY++
          break
        case 'IDLE':
          cat.IDLE++
          break
        case 'OFFLINE':
          cat.OFFLINE++
          break
      }
      return cat
    }, {
      BUSY: 0,
      IDLE: 0,
      OFFLINE: 0,
    })
    cate.ALL = agents.size
    return <TabBars className={classes.toolbars}
      value={category} onChange={this.selectCategory}>
      {this.renderFilterItem('ALL', cate)}
      {this.renderFilterItem('BUSY', cate)}
      {this.renderFilterItem('IDLE', cate)}
      {this.renderFilterItem('OFFLINE', cate)}
    </TabBars>
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  render () {
    const { loading } = this.props
    const { openConfirm, openConfig, selected } = this.state
    const confirmTitle = selected ? `确认删除 ${selected.get('name')} ?`
    : 'Confirm'
    return <div className={classes.container}>
      {!loading && this.renderFilter()}
      {loading ? this.renderLoading() : this.renderAgents()}
      <Confirm isOpen={openConfirm} title={confirmTitle}
        onCancel={this.closeConfirm}
        onOk={this.handleRemove}
      />
      <ConfigDialog agent={selected} isOpen={openConfig}
        onRequestClose={this.closeConfig}
      />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminAgentView)
)
