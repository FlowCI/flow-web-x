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

function mapStateToProps (state, props) {
  const { plugin } = state
  const plugins = pluginsSelector(plugin)
  return {
    plugins,
    counts: {
      ALL: plugins.size,
      ENABLED: plugins.count((p) => p.get('enabled')),
      DISABLED: plugins.count((p) => !p.get('enabled')),
      UPDATEABLED: 0,
    }
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.queryInstalled,

    upgrade: actions.install,
    remove: actions.uninstall,

    freed: actions.freed,
  }, dispatch)
}

export class PluginController extends Component {
  static propTypes = {
    counts: PropTypes.shape({
      ALL: PropTypes.number,
      ENABLED: PropTypes.number,
      DISABLED: PropTypes.number,
      UPDATEABLED: PropTypes.number,
    }).isRequired,

    plugins: ImmutablePropTypes.list.isRequired,

    query: PropTypes.func.isRequired,
    upgrade: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    freed: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: _i18n,
  }

  state = {
    category: 'ALL',
    keyword: '',
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  componentWillUnmount () {
    const { freed } = this.props
    freed()
  }

  handleCateChange = (v) => {
    this.setState({ category: v })
  }

  handleSearch = (keyword) => {
    this.setState({ keyword }, this.refresh)
  }

  refresh = () => {
    const { query } = this.props
    const { keyword } = this.state
    query(undefined, keyword)
  }

  handleUpgrade = (plugin) => {
    const { upgrade } = this.props
    return upgrade(plugin.get('name'))
  }

  handleRemove = (plugin) => {
    const { remove } = this.props
    return remove(plugin.get('name'))
  }

  render () {
    const { counts, i18n, plugins } = this.props
    const { category } = this.state
    return <div>
      <Toolbar counts={counts} category={category}
        i18n={i18n.createChild('toolbar')}
        onChange={this.handleCateChange}
        onSearch={this.handleSearch}
      />
      <Plugins plugins={plugins} i18n={i18n.createChild('list')}
        remove={this.handleRemove} upgrade={this.handleUpgrade} />
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(PluginController)
)
