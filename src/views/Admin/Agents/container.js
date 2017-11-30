import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import is from 'util/is'

import _i18n from './i18n'
import { connect } from 'react-redux'
import { createNavbarSelector, createActiveNavbarSelector } from 'util/route'

import DocumentTitle from 'react-document-title'
import Navbar from '../components/Navbar'

const navbarSelector = createNavbarSelector()
const activeNavbarSelector = createActiveNavbarSelector()

function mapStateToProps (state, { routes, route }) {
  const active = activeNavbarSelector(routes, route)
  return {
    menus: navbarSelector(route),
    title: is.string(active.navbar) ? active.navbar : (active.path || 'index')
  }
}

export class AdminAgentContainer extends PureComponent {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,

    base: PropTypes.string.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    base: '/admin/agents',
    i18n: _i18n,
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

export default connect(mapStateToProps)(AdminAgentContainer)
