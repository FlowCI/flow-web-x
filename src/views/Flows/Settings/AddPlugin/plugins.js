import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import autoCancel from 'react-promise-cancel'

import { actions as pluginActions } from 'redux/modules/plugin'

import Toolbar from './Toolbar'
import Plugins from './PluginList'

import classes from './plugins.scss'

const pluginsSelector = createSelector(
  (state) => state.get('list'),
  (state) => state.get('data'),
  (list, data) => list.map((id) => data.get(id)).toList()
)

function mapStateToProps (state, props) {
  const { plugin } = state
  const plugins = pluginsSelector(plugin)
  return {
    plugins,
    labels: plugin.get('labels'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: pluginActions.queryInstalled,
    queryLabels: pluginActions.queryLabels,
  }, dispatch)
}

export class FlowPlugins extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    labels: ImmutablePropTypes.list.isRequired,
    plugins: ImmutablePropTypes.list.isRequired,

    queryLabels: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,

    onSelect: PropTypes.func.isRequired,
  }

  state = {
    label: undefined,
    keyword: undefined,
  }

  componentDidMount () {
    const { labels, queryLabels } = this.props
    this.refresh()
    !labels.size && queryLabels()
  }

  handleLabelChange = (label) => {
    this.setState({ label }, this.refresh)
  }

  handleSearch = (keyword) => {
    this.setState({ keyword }, this.refresh)
  }

  refresh = () => {
    const { query } = this.props
    const { label, keyword } = this.state
    query(label, keyword)
  }

  handleSelect = (plugin) => {
    const { onSelect, flowId } = this.props
    onSelect(flowId, plugin)
  }

  render () {
    const { plugins, labels } = this.props
    const { label } = this.state
    return <div className={classes.container}>
      <Toolbar tags={labels} current={label}
        onTagChange={this.handleLabelChange}
        onSearch={this.handleSearch} />
      {<Plugins plugins={plugins} onSelect={this.handleSelect} />}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel([{
    funcs: ['queryLabels']
  }, {
    funcs: ['query'],
    trigger: 'unique'
  }])(FlowPlugins)
)
