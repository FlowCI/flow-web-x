import React, { PureComponent } from 'react'
import { func, string, bool } from 'prop-types'
import { list, map } from 'react-immutable-proptypes'

import classes from './menus.scss'

export class AdminFlowMemberMenuItem extends PureComponent {
  static propTypes = {
    flow: map.isRequired,
    active: bool,
    onActive: func,
  }

  handleClick = () => {
    const { onActive, flow } = this.props
    onActive && onActive(flow)
  }

  render () {
    const { flow, active } = this.props
    const cls = [classes.item]
    active && cls.push(classes.active)
    return <li onClick={this.handleClick} className={cls.join(' ')}>
      {flow.get('id')}
    </li>
  }
}

export default class AdminFlowsMemberMenus extends PureComponent {
  static propTypes = {
    flows: list.isRequired,
    selected: string,
    onItemActive: func
  }

  componentDidMount () {
    const { selected, flows, onItemActive } = this.props
    if (!selected) {
      onItemActive && onItemActive(flows.get(0))
    }
  }

  render () {
    const { flows, selected, onItemActive } = this.props
    return <ul className={classes.menus}>
      {flows.map((flow) => {
        const id = flow.get('id')
        return <AdminFlowMemberMenuItem key={id} flow={flow}
          active={selected === id} onActive={onItemActive} />
      })}
    </ul>
  }
}
