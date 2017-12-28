import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import is from 'util/is'

import Step from './step'
import StartNode from './StartNode'
import EndNode from './EndNode'
import DashedNode from './DashedNode'
import classes from './steps.scss'

export default class FlowSteps extends Component {
  static propTypes = {
    base: PropTypes.string.isRequired,
    isFinal: PropTypes.bool,
    flowId: PropTypes.string.isRequired,
    steps: ImmutablePropTypes.list.isRequired,
    abstractStep: ImmutablePropTypes.map,

    active: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  state = {
    steps: this.props.steps,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.steps !== nextProps.steps) {
      this.setState({ steps: nextProps.steps })
    }
  }

  handleBeginDrag = (beginIndex) => {
    /**
     * 不需要重新渲染
     */
    this.state.begin = beginIndex
  }

  handleEndDrag = () => {
    const { begin, end } = this.state
    if (begin === end) {
      return
    }
    this.save()
  }

  save () {
    const { save, isFinal, flowId } = this.props
    const { steps } = this.state
    save(flowId, steps, { isFinal })
  }

  moveItem = (dragIndex, hoverIndex) => {
    const { steps } = this.state
    const dragItem = steps.get(dragIndex)
    const p = steps.splice(dragIndex, 1).splice(hoverIndex, 0, dragItem)
    /**
     * 使用同步赋值，防止在 endDrag 时还未进行完 setState，
     * 从而导致 steps 获取到的值不正确
     */
    this.state.steps = p
    /**
     * 通知刷新
     */
    this.setState({ end: hoverIndex })
  }

  handleActive = (event, step) => {
    event.stopPropagation()

    const { base, isFinal, redirect } = this.props
    const name = encodeURIComponent(step.get('name'))

    redirect(`${base}/${isFinal ? 'afterStep' : 'step'}/${name}`)
  }

  handleAddActive = (event) => {
    event.stopPropagation()

    const { redirect, isFinal, base } = this.props
    redirect(`${base}/add/${isFinal ? 'afterStep' : 'step'}`)
  }

  redirectToDefault = () => {
    const { redirect, base } = this.props
    redirect(`${base}/build`)
  }

  render () {
    const { active = {}, abstractStep, isFinal } = this.props
    const { steps } = this.state
    const isPluginActive = is.string(active)

    // 不写空字符串是为了防止名字刚好没有
    const activeName = isPluginActive ? decodeURI(active) : {}

    const isAfterStep = active && active.isAfterStep

    const isAdd = (isAfterStep === isFinal) && !isPluginActive && active.path
    const isStarted = !isFinal && !isPluginActive && !active.path

    return <div className={classes.steps}>
      <StartNode actived={isStarted} />
      {steps.map((p, i) => <Step key={p.get('id')} step={p}
        type={isFinal ? 'AFTER_STEP' : 'STEP'}
        actived={p.get('name') === activeName}
        index={i} move={this.moveItem}
        onActive={this.handleActive}
        beginDrag={this.handleBeginDrag}
        endDrag={this.handleEndDrag} />)}
      {isAdd && <DashedNode text={abstractStep ? abstractStep.get('name') : ''}
        remove={this.redirectToDefault} />}
      <EndNode actived={isAdd}
        onActive={this.handleAddActive} />
    </div>
  }
}
