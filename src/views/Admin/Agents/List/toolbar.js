import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  TabBars,
  Tab
} from '../../components/TabBars'
import Toolbar from '../../components/Toolbar'

export default class AgentToolBar extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    counts: PropTypes.shape({
      ALL: PropTypes.number,
      BUSY: PropTypes.number,
      IDLE: PropTypes.number,
      OFFLINE: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  renderItem (category, counts) {
    const { i18n } = this.props
    const text = i18n(category, { count: counts[category] || 0 })
    return <Tab value={category} text={text} />
  }

  render () {
    const { category, counts, onChange } = this.props
    return <Toolbar>
      <TabBars value={category} onChange={onChange}>
        {this.renderItem('ALL', counts)}
        {this.renderItem('BUSY', counts)}
        {this.renderItem('IDLE', counts)}
        {this.renderItem('OFFLINE', counts)}
      </TabBars>
    </Toolbar>
  }
}
