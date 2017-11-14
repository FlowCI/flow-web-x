import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { createSelector } from 'reselect'

import createI18n from './i18n'
import language from 'util/language'

import { actions as uiActions } from 'redux/modules/ui'

import DocumentTitle from 'react-document-title'

import { Tabs, Tab } from './components/Tabs'
import classes from './container.scss'

const navbarSelectors = createSelector(
  (props) => props.route.childRoutes,
  (routes) => routes.filter((route) => route.navbar)
)

function mapStateToProps (state, props) {
  const navbars = navbarSelectors(props)
  const { flow } = state
  const { params: { flowId } } = props
  return {
    menus: navbars,
    flowId,
    loaded: !!flow.getIn(['data', flowId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setBackUrl: uiActions.setBackUrl,
    freedBackUrl: uiActions.freedBackUrl
  }, dispatch)
}

export class FlowSettingsContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    menus: PropTypes.array.isRequired,
    flowId: PropTypes.string.isRequired,
    loaded: PropTypes.bool.isRequired,

    setBackUrl: PropTypes.func.isRequired,
    freedBackUrl: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language)
  }

  state = {
    base: `/flows/${this.props.flowId}/settings`
  }

  componentDidMount () {
    const { setBackUrl, flowId } = this.props
    setBackUrl(`/flows/${flowId}`)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.flowId !== nextProps.flowId) {
      this.setState({
        base: `/flows/${nextProps.flowId}/settings`
      })
    }
  }

  componentWillUnmount () {
    const { freedBackUrl } = this.props
    freedBackUrl()
  }

  render () {
    const { flowId, loaded, menus, i18n, children } = this.props
    const { base } = this.state
    return <DocumentTitle title={`${flowId} 工作流设置`}>
      <div className={classes.container}>
        <Tabs>
          {menus.map((m, i) => <Tab key={m.path}
            nav={m} base={base}
            i18n={i18n.createChild('navbar')}
          />)}
        </Tabs>
        {loaded && children}
      </div>
    </DocumentTitle>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowSettingsContainer)
