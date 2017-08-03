import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ClickAwayListener from 'components/ClickAwayListener'

import classes from './card.scss'

export default class NavbarCard extends PureComponent {
  static propTypes = {
    containerClass: PropTypes.string,
    className: PropTypes.string,
    active: PropTypes.bool,

    href: PropTypes.string,
    target: PropTypes.string,

    onActive: PropTypes.func,
    onRequestClose: PropTypes.func,

    children: PropTypes.node,
    dropDown: PropTypes.node,
  }

  static defaultProps = {
    containerClass: '',
    className: '',
  }

  handleCardClick = (e) => {
    const { active, href } = this.props
    !href && e.preventDefault()
    const handle = active ? this.props.onRequestClose : this.props.onActive
    return handle && handle(e)
  }

  render () {
    const {
      href, target, active,
      containerClass, className,
      children, onRequestClose, dropDown
    } = this.props

    const cls = [classes.card, className]
    active && cls.push(classes.active)

    return <ClickAwayListener
      onClickAway={active && !!dropDown && onRequestClose}>
      <div className={containerClass}>
        <a href={href || '#'} target={target}
          rel='noopener' className={cls.join(' ')}
          onClick={this.handleCardClick}>
          {children}
        </a>
        {active && dropDown}
      </div>
    </ClickAwayListener>
  }
}
