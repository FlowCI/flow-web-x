import React, { PureComponent } from 'react'

import Card from './card'
import AgentsDropDown from '../DropDown/agents'

// import classes from './flow.scss'

export default class NavbarAgentCard extends PureComponent {
  render () {
    return <Card {...this.props}
      dropDown={<AgentsDropDown {...this.props} />}>
      <i className='icon icon-agents' />
    </Card>
  }
}
