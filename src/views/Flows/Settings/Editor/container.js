import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { Map } from 'immutable'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { bindActionCreators } from 'redux'
import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/step'
import { push } from 'react-router-redux'

import { Link } from 'react-router'
import Steps from './Steps'

import classes from './container.scss'

const childRouteSelector = createSelector(
  ({ routes, route }) => routes,
  ({ routes, route }) => route,
  (routes, route) => routes[routes.indexOf(route) + 1],
)

const stepsSelector = createSelector(
  (state) => state.get('list'),
  (state) => state.get('data'),
  (list, data) => {
    const steps = list.map((id) => data.get(id)).toList()
    return {
      afterSteps: steps.filter((step) => step.get('isFinal')),
      steps: steps.filter((step) => !step.get('isFinal')),
    }
  }
)

function mapStateToProps (state, props) {
  const { flow, step } = state
  const { params: { flowId, stepName } } = props
  const f = flow.getIn(['data', flowId], new Map())
  const childRoute = childRouteSelector(props)

  const s = stepsSelector(step)
  return {
    flowId,
    git: f.getIn(['envs', 'FLOW_GIT_URL'], ''),
    name: f.get('name', ''),
    active: stepName || childRoute, // 开始及结束节点用 route 表示状态， 插件使用插件名
    isActiveAfterStep: childRoute.isAfterStep,
    base: `/flows/${flowId}/settings/editor`,

    steps: s.steps,
    afterSteps: s.afterSteps,

    abstractStep: step.getIn(['ui', 'abstractStep']),
    yml: flow.getIn(['yml', flowId])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    freed: actions.freed,
    save: actions.update,
    redirect: push,
  }, dispatch)
}

export class FlowEditorContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    base: PropTypes.string.isRequired,

    flowId: PropTypes.string.isRequired,
    git: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    yml: PropTypes.string,
    steps: ImmutablePropTypes.list.isRequired,
    afterSteps: ImmutablePropTypes.list.isRequired,
    abstractStep: ImmutablePropTypes.map,

    active: PropTypes.any,
    isActiveAfterStep: PropTypes.bool,
    children: PropTypes.node,

    query: PropTypes.func.isRequired,
    freed: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { query, flowId } = this.props
    query(flowId)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.yml && this.props.yml !== nextProps.yml) {
      const { query, flowId } = nextProps
      query(flowId)
    }
  }

  componentWillUnmount () {
    const { freed, flowId } = this.props
    freed(flowId)
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  handleClick = () => {
    const { base, redirect, location } = this.props
    const href = `${base}/build`
    if (location.pathname !== href) {
      redirect({
        ...location,
        pathname: href,
      })
    }
  }

  save = (flowId, nextSteps, { isFinal }) => {
    const { save, steps, afterSteps } = this.props

    const saveSteps = isFinal ? steps.concat(nextSteps)
      : nextSteps.concat(afterSteps)
    save(flowId, saveSteps)
  }

  render () {
    const {
      base, flowId, git,
      steps, afterSteps,
      name, active, isActiveAfterStep,
      children, abstractStep,
      redirect,
    } = this.props

    return <div>
      <div className={classes.panel} onClick={this.handleClick}>
        <Link to={`/flows/${flowId}/settings/editor/edit`}
          onClick={this.stopPropagation}
          className={classes.ymlLink}>
          通过 yml 配置工作流
        </Link>
        <div className={classes.header}>
          <h4 className={classes.title}>{name}</h4>
          <h5 className={classes.subTitle}>{git}</h5>
        </div>
        <h5 className={classes.stepHeader}>Step</h5>
        <Steps base={base} flowId={flowId}
          steps={steps} active={active}
          abstractStep={isActiveAfterStep ? undefined : abstractStep}
          save={this.save} redirect={redirect}
        />
        <h5 className={classes.stepHeader}>After Step</h5>
        <Steps base={base} flowId={flowId} isFinal
          steps={afterSteps} active={isActiveAfterStep ? active : undefined}
          abstractStep={isActiveAfterStep ? abstractStep : undefined}
          save={this.save} redirect={redirect}
        />
      </div>
      {children}
    </div>
  }
}
export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(
    autoCancel({ funcs: ['query'] })(FlowEditorContainer)
  )
)
