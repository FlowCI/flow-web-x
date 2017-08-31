import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/agent'
import { actions as jobActions } from 'redux/modules/job'

import Loading from 'components/Loading'
import { NavTabs } from 'components/NavTabs'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
} from '../components/List'
import {
  TabBars,
  Tab
} from '../components/TabBars'

import Agent from './agent'
import classes from './agents.scss'

function mapStateToProps (state, props) {
  const { agent } = state
  return {
    agents: agent.get('list'),
    loading: agent.getIn(['ui', 'QUERY']) !== STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    stop: jobActions.stop,
    shutdown: actions.shutdown,
  }, dispatch)
}

export class AdminAgentView extends Component {
  static propTypes = {
    agents: list.isRequired,
    loading: bool,

    query: func.isRequired,
    stop: func.isRequired,
    shutdown: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  state = {
    category: 'ALL',
  }

  componentDidMount () {
    const { query } = this.props
    query()
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

  renderAgent = (agent) => {
    const { stop, shutdown } = this.props
    return <Agent key={agent.get('id')} agent={agent}
      stop={stop} shutdown={shutdown}
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
    return <TabBars value={category} onChange={this.selectCategory}>
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
    return <div className={classes.container}>
      <NavTabs className={classes.navs}>
        Agent
      </NavTabs>
      {!loading && this.renderFilter()}
      {loading ? this.renderLoading() : this.renderAgents()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminAgentView)
)
