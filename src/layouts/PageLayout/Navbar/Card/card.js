import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ClickAwayListener from 'components/ClickAwayListener'
import { Link } from 'react-router'

import classes from './card.scss'

export default class NavbarCard extends PureComponent {
  static propTypes = {
    containerClass: PropTypes.string,
    className: PropTypes.string,
    active: PropTypes.bool,

    href: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
    const { active, href, to } = this.props
    !href && !to && e.preventDefault()
    const handle = active ? this.props.onRequestClose : this.props.onActive
    return handle && handle(e)
  }

  render () {
    const {
      href, to, target, active,
      containerClass, className,
      children, onRequestClose, dropDown
    } = this.props

    const cls = [classes.card, className]
    active && cls.push(classes.active)

    const content = React.createElement(to ? Link : 'a', {
      href: to ? undefined : (href || '#'),
      to,
      target,
      rel: 'noopener',
      className: cls.join(' '),
      onClick: this.handleCardClick
    }, children)

    return <ClickAwayListener
      onClickAway={active && !!dropDown && onRequestClose}>
      <div className={containerClass}>
        {content}
        {active && dropDown}
      </div>
    </ClickAwayListener>
  }
}
