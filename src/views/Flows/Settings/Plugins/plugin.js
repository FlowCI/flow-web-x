import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import IconButton from 'components/IconButton'
import { Ul, Li } from 'components/InlineUl'

import classes from './plugins.scss'

export default class FlowPlugin extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,
    install: PropTypes.func.isRequired,
  }

  handleInstall = () => {
    const { install, plugin } = this.props
    return install(plugin)
  }

  render () {
    const { plugin } = this.props
    const labels = plugin.get('labels')

    return <div className={classes.plugin}>
      <div className={classes.actions}>
        <IconButton onClick={this.handleInstall}>
          <i className='icon icon-add_circle' />
        </IconButton>
      </div>
      <div className={classes.name}>
        {plugin.get('name')}
      </div>
      <div className={classes.desc}>
        <h5 className={classes.strong}>{plugin.get('description')}</h5>
        <Ul className={classes.tags}>
          <Li>版本: {plugin.get('currentTag')}</Li>
          {labels.map((t) => <Li key={t}>{t}</Li>)}
          <Li>
            <a href={plugin.get('source')} target='_blank'>使用帮助</a>
          </Li>
        </Ul>
      </div>
    </div>
  }
}
