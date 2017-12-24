import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import autoCancel from 'react-promise-cancel'

import { actions as pluginActions } from 'redux/modules/plugin'
import { actions } from 'redux/modules/step'

import Toolbar from './toolbar'
import Plugins from './plugins'

import classes from './container.scss'

const pluginsSelector = createSelector(
  (state) => state.get('list'),
  (state) => state.get('data'),
  (list, data) => list.map((id) => data.get(id)).toList()
)
const labelsSelector = createSelector(
  (state) => state.get('labels'),
  (labels) => labels.toArray()
)

function mapStateToProps (state, props) {
  const { plugin } = state
  const plugins = pluginsSelector(plugin)
  return {
    plugins,
    labels: labelsSelector(plugin)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: pluginActions.queryInstalled,
    queryLabels: pluginActions.queryLabels,
    install: actions.addPlugin,
    freed: pluginActions.freed,
  }, dispatch)
}

export class FlowPluginController extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    labels: PropTypes.array.isRequired,
    plugins: ImmutablePropTypes.list.isRequired,

    queryLabels: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
    install: PropTypes.func.isRequired,
  }

  state = {
    label: undefined,
    keyword: undefined,
  }

  componentDidMount () {
    const { labels, query, queryLabels } = this.props
    query()
    !labels.size && queryLabels()
  }

  componentWillUnmount () {
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

  handleInstall = (plugin) => {
    const { install, flowId } = this.props
    return install(flowId, plugin)
  }

  render () {
    const { plugins, labels } = this.props
    const { label } = this.state
    return <div className={classes.container}>
      <Toolbar tags={labels} current={label} onChange={this.handleLabelChange}
        onSearch={this.handleSearch} />
      {<Plugins plugins={plugins} install={this.handleInstall} />}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel([{
    funcs: ['queryLabels']
  }, {
    funcs: ['query'],
    trigger: 'unique'
  }])(FlowPluginController)
)
