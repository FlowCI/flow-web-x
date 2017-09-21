import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'

import classes from './navbar.scss'

export default class JobStatusHeader extends Component {
  static propTypes = {
    base: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { base, i18n } = this.props
    return <ul className={classes.navbar}>
      <li>
        <Link to={base} className={classes.nav}
          onlyActiveOnIndex activeClassName='active'>
          {i18n('详细信息')}
        </Link>
      </li>
      <li>
        <Link to={{ ...base, pathname: `${base.pathname}/logs` }}
          className={classes.nav}
          activeClassName='active'>
          {i18n('构建日志')}
        </Link>
      </li>
    </ul>
  }
}
