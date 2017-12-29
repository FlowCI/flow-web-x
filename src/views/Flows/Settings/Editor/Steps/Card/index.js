import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { DragSource, DropTarget } from 'react-dnd'

import classnames from 'classnames'
import classes from './card.scss'

const cardSource = {
  beginDrag (props) {
    // call start drag callback to set begin index
    const { index, data, beginDrag } = props
    beginDrag && beginDrag(index, data)
    return {
      index: index,
      data: data
    }
  },
  /**
   * 由于每个 DropTarget 大小可能不一致，在响应 hover 时会重新排列，导致原本应该在
   * DropTarget 上的 DragSource 在重排后并不在 DropTarget 上，从而导致在其父元素上
   * 触发 drag 事件，从而 monitor.didDrop() 为 false，所以并不能以 endDrag 时的状态
   * 为最终排序结果。 endDrag 方法仅作为拖拽结束标识。
   */
  endDrag (props, monitor, component) {
    const { endDrag } = props
    endDrag && endDrag()
  }
}
const cardTarget = {
  hover (props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.move(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}

export class FlowDragCard extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,

    index: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    data: PropTypes.any, // eslint-disable-line react/no-unused-prop-types

    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,

    beginDrag: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    endDrag: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    move: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    onClick: PropTypes.func,
  }

  render () {
    const {
      children,
      className,
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      onClick,
    } = this.props
    return connectDragPreview(connectDropTarget(
      <span className={classnames(className, {
        dragging: isDragging,
      })} onClick={onClick}>
        {connectDragSource(<i className={classnames('icon icon-drag',
          classes.source)} />)}
        <span>{children}</span>
      </span>
    ))
  }
}

export default class FlowDragCardHightOrderComponent extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired
  }

  constructor (props, context) {
    super(props, context)
    const { type } = props

    this.renderComponent = DropTarget(type, cardTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
    }))(
      DragSource(type, cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
      }))(FlowDragCard)
    )
  }

  render () {
    return React.createElement(this.renderComponent, this.props)
  }
}
