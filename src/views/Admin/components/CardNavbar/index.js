import React, { PureComponent } from 'react'
import { array, func } from 'prop-types'

import { Link } from 'react-router'

import classes from './navbar.scss'

export default class AdminCardNavbars extends PureComponent {
  static propTypes = {
    navbars: array.isRequired,
    i18n: func.isRequired,
  }

  render () {
    const { navbars, i18n } = this.props
    return <ul className={classes.navbar}>
      {navbars.map((nav) => <li key={nav.path}>
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
