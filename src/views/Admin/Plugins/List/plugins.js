import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Plugin from './plugin'
import classes from './plugin.scss'

export default class PluginList extends Component {
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
    return <div className={classes.plugins}>
      <div className={classes.header}>
        <div className={classes.icon}>{' '}</div>
        <div className={classes.plugin}>
          {i18n('plugin')}
        </div>
        <div className={classes.desc}>
          {i18n('desc')}
        </div>
      </div>
      <div className={classes.body}>
        {plugins.map(this.renderPlugin)}
      </div>
    </div>
  }
}
