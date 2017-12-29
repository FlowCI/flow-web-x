import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Button from 'components/Buttonx'
import { PluginListItem } from '../components/Plugins'

export default class AddPluginController extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,
    /**
     * 设置 是否启用 function (plugin: Plugin) {}
     */
    install: PropTypes.func.isRequired,
  }

  handleInstall = () => {
    const { install, plugin } = this.props
    return install(plugin)
  }

  renderActions () {
    const { plugin } = this.props
    const status = plugin.get('status')
    if (status === 'INSTALLED') {
      return
    } else if (status === 'INSTALLING' || status === 'IN_QUEUE') {
      return <Button size='xs'>正在安装</Button>
    }
    return <Button size='xs' type='primary' onClick={this.handleInstall}>
      安装
    </Button>
  }

  render () {
    const { plugin } = this.props
    return <PluginListItem plugin={plugin}
      actions={this.renderActions()} />
  }
}
