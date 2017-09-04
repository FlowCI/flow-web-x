import React, { Component } from 'react'
import { func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import {
  TabBars,
  Tab
} from '../../components/TabBars'

import Menus from './menus'

import classes from './members.scss'

const flowsSelector = createSelector(
  (flows) => flows.get('list'),
  (flows) => flows.get('data'),
  (ids, data) => ids.toList().map((id) => data.get(id))
)

function mapStateToProps (state, props) {
  return {
    flows: flowsSelector(state.flow)
  }
}

export class AdminFlowMembers extends Component {
  static propTypes = {
    flows: list.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('members'),
  }

  state = {

  }

  handleMenuClick = (flow) => {
    this.setState({ selected: flow.get('id') })
  }

  renderToolBars () {
    const { i18n, flows } = this.props
    return <div className={classes.toolbar}>
      <TabBars value='all'>
        <Tab text={i18n('toolbar.all', { count: flows.size })} value='all' />
      </TabBars>
    </div>
  }

  render () {
    const { flows } = this.props
    const { selected } = this.state
    return <div>
      {this.renderToolBars()}
      <div className={classes.panel}>
        <Menus flows={flows} selected={selected}
          onItemActive={this.handleMenuClick} />
      </div>
    </div>
  }
}

export default connect(mapStateToProps)(AdminFlowMembers)
