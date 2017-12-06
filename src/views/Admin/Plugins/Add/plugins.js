import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { PluginList } from '../components/Plugins'
import Plugin from './plugin'

export default class AddPluginsList extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,

    /**
     * 安装插件  function (plugin: Plugin) {}
     */
    install: PropTypes.func,
    i18n: PropTypes.func.isRequired,
  }

  renderPlugin = (plugin) => {
    const { i18n, install } = this.props
    return <Plugin key={plugin.get('name')} plugin={plugin}
      i18n={i18n} install={install} />
  }

  render () {
    const { plugins, i18n } = this.props
    return <PluginList i18n={i18n}>
      {plugins.map(this.renderPlugin)}
    </PluginList>
  }
}
