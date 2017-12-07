import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'

import classes from './tabs.scss'

export default class FlowSettingTab extends Component {
  static propTypes = {
    base: PropTypes.string.isRequired,
    nav: PropTypes.shape({
      path: PropTypes.string.isRequired,
      text: PropTypes.string,
    }),
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: function (n) { return n }
  }

  render () {
    const { base, nav, i18n } = this.props
    return <Link to={`${base}${nav.path}`}
      className={classes.tab}
      activeClassName={classes.active}>
      {i18n(nav.text)}
    </Link>
  }
}
