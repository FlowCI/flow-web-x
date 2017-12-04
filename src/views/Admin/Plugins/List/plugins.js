import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { PluginList } from '../components/Plugins'
import Plugin from './plugin'

export default class PluginsController extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,

    /**
     * 设置 是否启用 function (plugin: Plugin, enabled: bool) {}
     */
    toggle: PropTypes.func,
    /**
     * 删除 plugin function (plugin: Plugin) {}
     */
    remove: PropTypes.func,
    i18n: PropTypes.func.isRequired,
  }

  renderPlugin = (plugin) => {
    const { i18n, toggle, remove } = this.props
    return <Plugin key={plugin.get('name')} plugin={plugin} i18n={i18n}
      toggle={toggle} remove={remove} />
  }

  render () {
    const { plugins, i18n } = this.props
    return <PluginList i18n={i18n}>
      {plugins.map(this.renderPlugin)}
    </PluginList>
  }
}
