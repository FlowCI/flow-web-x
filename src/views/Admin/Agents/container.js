import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createNavbarSelector, createActiveNavbarSelector } from 'util/route'

import DocumentTitle from 'react-document-title'
import { NavTabs, Nav } from 'components/NavTabs'

import classes from './container.scss'

const navbarSelector = createNavbarSelector()
const activeNavbarSelector = createActiveNavbarSelector()

function mapStateToProps (state, props) {
  return {
    menus: navbarSelector(props),
    activeMenu: activeNavbarSelector(props)
  }
}

export class AdminAgentContainer extends PureComponent {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    activeMenu: PropTypes.shape({
      navbar: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,

    base: PropTypes.string.isRequired,
  }

  static defaultProps = {
    base: '/admin/agents',
  }

  render () {
    const {
      base, menus,
      activeMenu, children
    } = this.props
    return <div>
      <NavTabs className={classes.navbar}>
        {menus.map((menu) => {
          const path = menu.path || ''
          return <Nav key={path} to={`${base}/${path}`} onlyActiveOnIndex>
            {menu.navbar}
          </Nav>
        })}
      </NavTabs>
      <DocumentTitle title={activeMenu.title}>
        {children}
      </DocumentTitle>
    </div>
  }
}

export default connect(mapStateToProps)(AdminAgentContainer)
