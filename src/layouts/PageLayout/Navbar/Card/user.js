import React, { PureComponent } from 'react'

import Card from './card'
// import classes from './flow.scss'

export default class NavbarUserCard extends PureComponent {
  render () {
    return <Card {...this.props}>
      <i className='icon icon-user' />
    </Card>
  }
}
