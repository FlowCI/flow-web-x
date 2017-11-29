import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import getCapacity from 'util/capacity'

import Loading from 'components/Loading'

import AgentSystemSubscriber from '../../Socket/system'
import classes from './dialog.scss'

export default class AgentDialogContent extends Component {
  static propTypes = {
    agent: map,
    getSystemInfo: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    system: undefined,
  }

  componentDidMount () {
    const { agent, getSystemInfo } = this.props
    getSystemInfo(agent)
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  handleMessage = (agent, system) => {
    this.setState({ system })
  }

  renderItem (key, value) {
    return <tr className={classes.item} key={key}>
      <td className={classes.name}>{key}</td>
      <td className={classes.value}>{value}</td>
    </tr>
  }

  renderContent () {
    const { i18n } = this.props
    const { system } = this.state
    const { useMemory, totalMemory, ...other } = system
    const keys = Object.keys(other)
    return <table className={classes.table}>
      <thead>
        <tr className={classes.header}>
          <th>{i18n('key')}</th>
          <th>{i18n('value')}</th>
        </tr>
      </thead>
      <tbody>
        {this.renderItem('Memory',
          `${getCapacity(useMemory)}/${getCapacity(totalMemory)}`)}
        {keys.map((key) => this.renderItem(key, system[key]))}
      </tbody>
    </table>
  }

  renderLoading () {
    return <Loading />
  }

  render () {
    const { agent } = this.props
    const { system } = this.state
    return <AgentSystemSubscriber agent={agent}
      onMessage={this.handleMessage}>
      {system ? this.renderContent() : this.renderLoading()}
    </AgentSystemSubscriber>
  }
}
