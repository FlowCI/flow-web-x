import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
} from '../../components/List'
import Agent from './agent'
import classes from './agents.scss'

export default class AdminAgentView extends Component {
  static propTypes = {
    agents: ImmutablePropTypes.list.isRequired,
    category: PropTypes.string.isRequired,

    stop: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    openDetail: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,

    i18n: PropTypes.func.isRequired,
  }

  getAgents () {
    const { agents, category } = this.props
    return category === 'ALL' ? agents : agents.filter((agent) =>
      agent.get('agentStatus') === category)
  }

  renderAgent = (agent) => {
    const { stop, close, openDetail, remove, i18n } = this.props
    return <Agent key={agent.get('id')} agent={agent}
      stop={stop} close={close} remove={remove}
      openDetail={openDetail} i18n={i18n}
    />
  }

  render () {
    const { i18n } = this.props
    const agents = this.getAgents()
    return <div className={classes.scroller}>
      <List className={classes.agents}>
        <ListHead>
          <ListRow>
            <ListHeadCol className={classes.status}>
              {i18n('status')}
            </ListHeadCol>
            <ListHeadCol className={classes.name}>
              {i18n('agent')}
            </ListHeadCol>
            <ListHeadCol className={classes.job}>
              {i18n('build')}
            </ListHeadCol>
            <ListHeadCol className={classes.token}>
              {i18n('token')}
            </ListHeadCol>
            <ListHeadCol className={classes.actions}>
              {i18n('actions')}
            </ListHeadCol>
          </ListRow>
        </ListHead>
        <ListBody>
          {agents.map(this.renderAgent)}
        </ListBody>
      </List>
    </div>
  }
}
