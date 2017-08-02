import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import NavbarUserDropDown from '../DropDown/user'
import Card from './card'

export default class NavbarUserCard extends PureComponent {
  static propTypes = {
    onRequestClose: PropTypes.func,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    return <Card {...this.props}
      dropDown={<NavbarUserDropDown {...this.props} />}>
      <i className='icon icon-user' />
    </Card>
  }
}
