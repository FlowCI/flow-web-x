import React, { Component } from 'react'
import { array, node, func } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'

import { createSelector } from 'reselect'

import Menus from './components/Menus'

import classes from './container.scss'

const navbarSelectors = createSelector(
  (props) => props.route.childRoutes,
  (routes) => routes.filter((route) => route.navbar)
)

function mapStateToProps (state, props) {
  const navbars = navbarSelectors(props)
  return {
    menus: navbars,
  }
}

export class AdminContainer extends Component {
  static propTypes = {
    menus: array.isRequired,

    children: node,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  render () {
    const { i18n, menus, children } = this.props
    return <div className={classes.container}>
      <div className={classes.navbar}>
        <Menus menus={menus} i18n={i18n} />
      </div>
      <div className={classes.content}>
        {children}
      </div>
    </div>
  }
}
export default connect(mapStateToProps)(AdminContainer)
