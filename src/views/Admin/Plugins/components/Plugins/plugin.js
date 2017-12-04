import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Ul, Li } from 'components/InlineUl'

import classnames from 'classnames'
import classes from './plugin.scss'

export default class PluginListItem extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,
    actions: PropTypes.node,
    children: PropTypes.node,
  }

  renderName () {
    const { plugin, actions } = this.props
    return <div className={classes.plugin}>
      <h5 className={classnames(classes.strong, classes.name)}>
        {plugin.get('name')}
      </h5>
      {actions}
    </div>
  }

  renderDesc () {
    const { plugin } = this.props
    const tags = plugin.get('tags')
    return <div className={classes.desc}>
      <h5 className={classes.strong}>{plugin.get('desc')}</h5>
      <Ul className={classes.tags}>
        <Li>版本: {plugin.get('version')}</Li>
        {tags.map((t) => <Li key={t}>{t}</Li>)}
        <Li>
          <a href={plugin.get('link')} target='_blank'>使用帮助</a>
        </Li>
      </Ul>
    </div>
  }

  renderPlugin () {
    return <div className={classes.item}>
      <div className={classes.icon}>
        <i className='icon icon-jigsaw' />
      </div>
      {this.renderName()}
      {this.renderDesc()}
    </div>
  }

  render () {
    const { children } = this.props
    if (children) {
      return <div className={classes.itemGroup}>
        {this.renderPlugin()}
        {children}
      </div>
    }
    return this.renderPlugin()
  }
}
