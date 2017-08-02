import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Arrow from 'components/Arrow'

import classes from './dropdown.scss'

export default class NavbarDropdown extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    arrowClass: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    className: '',
    arrowClass: '',
  }

  render () {
    const {
      className, arrowClass, children,
    } = this.props

    const cls = [classes.dropmenu, className]
    return <div className={cls.join(' ')}>
      <Arrow up className={`${classes.arrow} ${arrowClass}`} />
      <div className={classes.content}>
        {children}
      </div>
    </div>
  }
}
