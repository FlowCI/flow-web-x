import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import createI18n from '../i18n'
import language from 'util/language'
import { createBasePathSelector } from 'util/route'

import { Tabs, Tab } from '../components/Tabs'
import classes from './container.scss'

const navbarSelectors = createSelector(
  (props) => props.route.childRoutes,
  (routes) => routes.filter((route) => route.navbar)
)
const baseSelectors = createBasePathSelector(true)

function mapStateToProps (state, props) {
  const navbars = navbarSelectors(props)
  const { flow } = state
  const { params: { flowId } } = props
  return {
    menus: navbars,
    loaded: !!flow.getIn(['data', flowId]),
    base: baseSelectors(props)
  }
}

export class FlowYmlSettingsContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    menus: PropTypes.array.isRequired,
    base: PropTypes.string.isRequired,
    loaded: PropTypes.bool.isRequired,

    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language)
  }

  render () {
    const { base, loaded, menus, i18n, children } = this.props
    return <div className={classes.container}>
      <Tabs>
        {menus.map((m, i) => <Tab key={m.path}
          nav={m} base={base}
          i18n={i18n.createChild('navbar')}
        />)}
      </Tabs>
      {loaded && children}
    </div>
  }
}
export default connect(mapStateToProps)(FlowYmlSettingsContainer)
