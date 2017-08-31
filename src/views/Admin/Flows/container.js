import React, { PureComponent } from 'react'
import { array, node, string, func } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { NavTabs, Nav, classes as navClasses } from 'components/NavTabs'

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

export class AdminFlowsContainer extends PureComponent {
  static propTypes = {
    menus: array.isRequired,
    children: node,
    base: string.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    base: '/admin/flows',
    i18n: createI18n(language),
  }

  render () {
    const { i18n, base, menus, children } = this.props
    return <div>
      <NavTabs className={classes.navbar}>
        {menus.map((menu) => <Nav
          key={menu.path}
          activeClassName={navClasses.active}
          to={`${base}/${menu.path}`}
        >
          {i18n(`${menu.path}.title`)}
        </Nav>)}
      </NavTabs>
      {children}
    </div>
  }
}

export default connect(mapStateToProps)(AdminFlowsContainer)
