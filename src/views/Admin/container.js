import React, { Component } from 'react'
import { array, node, func } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'

import { createSelector } from 'reselect'

import Navbars from './components/CardNavbar'

import classes from './container.scss'

const navbarSelectors = createSelector(
  (props) => props.route.childRoutes,
  (routes) => routes.filter((route) => route.navbar)
)

function mapStateToProps (state, props) {
  const navbars = navbarSelectors(props)
  return {
    navbars,
  }
}

export class AdminContainer extends Component {
  static propTypes = {
    navbars: array.isRequired,

    children: node,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  render () {
    const { i18n, navbars, children } = this.props
    return <div className={classes.container}>
      <div className={classes.navbar}>
        <Navbars navbars={navbars} i18n={i18n} />
      </div>
      <div className={classes.content}>
        this is child content panel
        {children}
      </div>
    </div>
  }
}
export default connect(mapStateToProps)(AdminContainer)
