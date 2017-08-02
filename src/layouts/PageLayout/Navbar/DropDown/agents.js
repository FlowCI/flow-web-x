import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import DropDown from './dropdown'

import classes from './agents.scss'
export default class AgentsDropDown extends PureComponent {
  static propTypes = {
    agents: PropTypes.array,

    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { i18n } = this.props
    return <DropDown className={classes.dropdown} arrowClass={classes.arrow}>
      <div className={classes.header}>
        {i18n('Agent 状态机')}
      </div>
    </DropDown>
  }
}
