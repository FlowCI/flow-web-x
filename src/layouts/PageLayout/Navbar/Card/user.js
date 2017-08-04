import React, { PureComponent } from 'react'

import NavbarUserDropDown from '../DropDown/user'
import Card from './card'

export default class NavbarUserCard extends PureComponent {
  render () {
    return <Card {...this.props}
      dropDown={<NavbarUserDropDown {...this.props} />}>
      <i className='icon icon-user' />
    </Card>
  }
}
