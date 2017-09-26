import React, { Component } from 'react'
import { func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/member'

import {
  TabBars,
  Tab
} from '../../components/TabBars'

import Menus from './menus'
import Members from './members'
import classes from './index.scss'

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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryMembers: actions.query,
  }, dispatch)
}

export class AdminFlowMembersPanel extends Component {
  static propTypes = {
    flows: list.isRequired,
    queryMembers: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('members'),
  }

  state = {}

  componentDidMount () {
    const { queryMembers } = this.props
    queryMembers()
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
    const { flows, i18n } = this.props
    const { selected } = this.state
    return <div>
      {this.renderToolBars()}
      <div className={classes.panel}>
        <Menus flows={flows} selected={selected}
          onItemActive={this.handleMenuClick} />
        <div className={classes.panelBody}>
          {!!selected && <Members flowName={selected} i18n={i18n} />}
        </div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryMembers'] })(AdminFlowMembersPanel)
)
