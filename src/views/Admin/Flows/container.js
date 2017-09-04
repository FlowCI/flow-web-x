import React, { PureComponent } from 'react'
import { array, node, string, bool, func } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { STATUS } from 'redux-http'

import { NavTabs, Nav, classes as navClasses } from 'components/NavTabs'
import Loading from 'components/Loading'

import classes from './container.scss'

const navbarSelectors = createSelector(
  (props) => props.route.childRoutes,
  (routes) => routes.filter((route) => route.navbar)
)

function mapStateToProps (state, props) {
  const { flow } = state
  const navbars = navbarSelectors(props)
  return {
    menus: navbars,
    loading: flow.getIn(['ui', 'QUERY']) !== STATUS.success,
  }
}

export class AdminFlowsContainer extends PureComponent {
  static propTypes = {
    menus: array.isRequired,
    loading: bool,
    children: node,

    base: string.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    base: '/admin/flows',
    i18n: createI18n(language),
  }

  render () {
    const { loading, i18n, base, menus, children } = this.props
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
      {loading ? <Loading /> : children}
    </div>
  }
}

export default connect(mapStateToProps)(AdminFlowsContainer)
