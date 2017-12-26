import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Map } from 'immutable'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'

import Steps from '../Steps'

import classes from './container.scss'

const childRouteSelector = createSelector(
  ({ routes, route }) => routes,
  ({ routes, route }) => route,
  (routes, route) => routes[routes.indexOf(route) + 1],
)

function mapStateToProps (state, props) {
  const { flow } = state
  const { params: { flowId, stepName } } = props
  const f = flow.getIn(['data', flowId], new Map())
  const childRoute = childRouteSelector(props)

  return {
    flowId,
    git: f.getIn(['envs', 'FLOW_GIT_URL'], ''),
    name: f.get('name', ''),
    active: stepName || childRoute // 开始及结束节点用 route 表示状态， 插件使用插件名
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}
export class FlowEditorContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    flowId: PropTypes.string.isRequired,
    git: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.any,
    children: PropTypes.node,
    redirect: PropTypes.func.isRequired,
  }

  handleClick = () => {
    const { redirect, location, flowId } = this.props
    const href = `/flows/${flowId}/settings/editor/build`
    if (location.pathname !== href) {
      redirect({
        ...location,
        pathname: href,
      })
    }
  }

  render () {
    const { flowId, git, name, active, children } = this.props
    return <div>
      <div className={classes.panel} onClick={this.handleClick}>
        <div className={classes.header}>
          <h4 className={classes.title}>{name}</h4>
          <h5 className={classes.subTitle}>{git}</h5>
        </div>
        <Steps flowId={flowId} active={active} />
      </div>
      {children}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowEditorContainer)
