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

  selectCategory (category, event) {
    event.preventDefault()
    this.setState({ category })
  }

  createSelected = (category) => {
    return this.selectCategory.bind(this, category)
  }

  getAgents () {
    const { agents } = this.props
    const { category } = this.state
    return agents.filter((agent) => category === 'ALL' ||
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
    return <table className={classes.agents}>
      <thead>
        <tr>
          <th className={classes.status}>{i18n('运行状态')}</th>
          <th className={classes.name}>{i18n('Agent')}</th>
          <th className={classes.job}>{i18n('任务')}</th>
          <th className={classes.actions}>{i18n('操作')}</th>
        </tr>
      </thead>
      <tbody>
        {agents.map(this.renderAgent)}
      </tbody>
    </table>
  }

  renderFilterItem (category, cate) {
    const { i18n } = this.props
    const { category: selected } = this.state
    const text = i18n(category, { count: cate[category] })
    return <li>
      <a href='#' className={category === selected ? classes.active : ''}
        title={text} onClick={this.createSelected(category)}
      >
        {text}
      </a>
    </li>
  }

  renderFilter () {
    const { agents } = this.props
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
    return <ul className={classes.filters}>
      {this.renderFilterItem('ALL', cate)}
      {this.renderFilterItem('BUSY', cate)}
      {this.renderFilterItem('IDLE', cate)}
      {this.renderFilterItem('OFFLINE', cate)}
    </ul>
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
