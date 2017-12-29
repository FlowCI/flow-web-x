import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import is from 'util/is'

import { NavTabs, Nav } from 'components/NavTabs'

import classes from './navbar.scss'

export default class AdminSecondaryNavbar extends PureComponent {
  static propTypes = {
    base: PropTypes.string.isRequired,
    menus: PropTypes.array.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { menus, base, i18n } = this.props
    return <NavTabs className={classes.navbar}>
      {menus.map((menu) => {
        const path = menu.path || ''
        const title = i18n(is.string(menu.navbar) ? menu.navbar
          : (menu.path || 'index'))
        return <Nav key={path} to={`${base}/${path}`} onlyActiveOnIndex>
          {i18n(title)}
        </Nav>
      })}
    </NavTabs>
  }
}
