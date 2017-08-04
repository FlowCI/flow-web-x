import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Arrow from 'components/Arrow'
import NavbarFlowsDropdown from '../DropDown/flows'
import Card from './card'
import classes from './flow.scss'

const LeftIcon = <i className='icon icon-branches' />

export default class NavbarFlowCard extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { i18n, active } = this.props
    return <Card {...this.props}
      containerClass={classes.container}
      className={classes.content}
      dropDown={<NavbarFlowsDropdown {...this.props} />}
    >
      {LeftIcon}
      <span>{i18n('Flow')}</span>
      <Arrow up={active} className={classes.arrow} />
    </Card>
  }
}
