import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import _i18n from './i18n'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/plugin'

import Toolbar from './toolbar'
import Plugins from './plugins'

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
    query: actions.query,
    queryLabels: actions.queryLabels,
    install: actions.install,
    freed: actions.freed,
  }, dispatch)
}

function noop () {}

export class AddPluginController extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,
    labels: PropTypes.array.isRequired,

    query: PropTypes.func.isRequired,
    queryLabels: PropTypes.func.isRequired,
    install: PropTypes.func.isRequired,
    freed: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: _i18n,
    query: noop,
    queryLabels: noop,
  }

  state = {
    label: undefined,
    keyword: undefined,
  }

  componentDidMount () {
    const { query, queryLabels } = this.props
    query()
    queryLabels()
  }

  componentWillUnmount () {
    const { freed } = this.props
    freed()
  }

  handleLabelChange = (label) => {
    this.setState({ label }, this.refresh)
  }

  handleSearch = (keyword) => {
    this.setState({ keyword }, this.refresh)
  }

  handleInstall = (plugin) => {
    const { install } = this.props
    return install(plugin.get('name'))
  }

  refresh = () => {
    const { query } = this.props
    const { label, keyword } = this.state
    query(undefined, label, keyword).catch(console.log)
  }

  render () {
    const { plugins, labels, i18n } = this.props
    const { label } = this.state
    return <div>
      <Toolbar tags={labels} current={label} onChange={this.handleLabelChange}
        onSearch={this.handleSearch} />
      {<Plugins plugins={plugins} i18n={i18n} install={this.handleInstall} />}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel([{
    funcs: ['queryLabels']
  }, {
    funcs: ['query'],
    trigger: 'unique'
  }])(AddPluginController)
)
