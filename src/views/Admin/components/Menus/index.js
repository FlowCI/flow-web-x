import React, { PureComponent } from 'react'
import { array, func } from 'prop-types'

import { Link } from 'react-router'

import classes from './menus.scss'

export default class AdminMenus extends PureComponent {
  static propTypes = {
    menus: array.isRequired,
    i18n: func.isRequired,
  }

  render () {
    const { menus, i18n } = this.props
    return <ul className={classes.navbar}>
      {menus.map((nav) => <li key={nav.path}>
        <Link to={`/admin/${nav.path}`}
          className={classes.nav}
          activeClassName={classes.active}>
          <span className={classes.icon}>
            <i className={`icon ${nav.icon}`} />
          </span>
          {i18n(nav.text)}
        </Link>
      </li>)}
    </ul>
  }
}
