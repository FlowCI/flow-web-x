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
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
  }, dispatch)
}

export class AddPluginController extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,

    query: PropTypes.func,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: _i18n
  }

  state = {
    tag: undefined
  }

  componentDidMount () {
    const { query } = this.props
    query && query()
  }

  handleTagChange = () => {

  }

  handleSearch = () => {

  }

  render () {
    const { plugins, i18n } = this.props
    const { tag } = this.state
    return <div>
      <Toolbar current={tag} onChange={this.handleTagChange}
        onSearch={this.handleSearch} />
      <Plugins plugins={plugins} i18n={i18n} />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AddPluginController)
)
