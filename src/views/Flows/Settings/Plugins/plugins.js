import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/plugin'

import Plugin from './plugin'
import StartNode from './StartNode'
import EndNode from './EndNode'

import classes from './plugins.scss'

const pluginsSelector = createSelector(
  (state) => state.get('list'),
  (state) => state.get('data'),
  (list, data) => list.map((id) => data.get(id)).toList()
)

function mapStateToProps (state, props) {
  const { plugin } = state
  return {
    plugins: pluginsSelector(plugin)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.get,
  }, dispatch)
}

export class FlowPlugins extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,
    onActive: PropTypes.func,
  }

  state = {
    plugins: this.props.plugins,
  }

  handleBeginDrag = (beginIndex) => {
    this.state.begin = beginIndex
  }

  handleEndDrag = (endIndex) => {
    const { begin } = this.state
    // call save state
    console.log(begin, 'to', endIndex)
  }

  moveItem = (dragIndex, hoverIndex) => {
    const { plugins } = this.state
    const dragItem = plugins.get(dragIndex)
    const p = plugins.splice(dragIndex, 1).splice(hoverIndex, 0, dragItem)
    this.setState({ plugins: p })
  }

  render () {
    const { plugins } = this.state
    return <div className={classes.plugins}>
      <StartNode />
      {plugins.map((p, i) => <Plugin key={p.get('name')} plugin={p}
        index={i} move={this.moveItem}
        beginDrag={this.handleBeginDrag}
        endDrag={this.handleEndDrag} />)}
      <EndNode />
    </div>
  }
}
export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(FlowPlugins)
)
