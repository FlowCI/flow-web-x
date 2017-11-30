import React, { Component } from 'react'
import PropTypes from 'prop-types'

import is from 'util/is'

import { connect } from 'react-redux'
import { createNavbarSelector, createActiveNavbarSelector } from 'util/route'

import DocumentTitle from 'react-document-title'
import Navbar from '../Navbar'

const navbarSelector = createNavbarSelector()
const activeNavbarSelector = createActiveNavbarSelector()

function mapStateToProps (state, { routes, route }) {
  const active = activeNavbarSelector(routes, route)
  return {
    menus: navbarSelector(route),
    title: is.string(active.navbar) ? active.navbar : (active.path || 'index')
  }
}

export class AdminNavbarContainer extends Component {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,

    base: PropTypes.string.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const {
      base, menus, i18n,
      title, children
    } = this.props
    return <div>
      <Navbar menus={menus} base={base} i18n={i18n.createChild('navbar')} />
      <DocumentTitle title={i18n(`document.${title}`)}>
        {children}
      </DocumentTitle>
    </div>
  }
}

export default connect(mapStateToProps)(AdminNavbarContainer)
