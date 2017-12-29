import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import IconButton from 'components/IconButton'
import { Ul, Li } from 'components/InlineUl'

import classes from './plugins.scss'

export default class FlowPluginListItem extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,

    onSelect: PropTypes.func.isRequired,
  }

  handleCheck = () => {
    const { plugin, onSelect } = this.props
    onSelect(plugin)
  }

  render () {
    const { plugin } = this.props
    const labels = plugin.get('labels')
    return <div className={classes.plugin}>
      <span className={classes.action}>
        <IconButton className={classes.install} onClick={this.handleCheck}>
          <i className='icon icon-add_circle' />
        </IconButton>
      </span>
      <div className={classes.name}>
        <h4>{plugin.get('name')}</h4>
        <Ul className={classes.labels}>
          <Li>版本 {plugin.get('currentTag')}</Li>
          {labels.map((label) => <Li key={label}>{label}</Li>)}
        </Ul>
      </div>
      <div className={classes.desc}>
        {plugin.get('description')}
      </div>
    </div>
  }
}
