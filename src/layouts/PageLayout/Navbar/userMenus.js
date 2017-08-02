import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'

import Popover from './popover'

import classes from './userMenus.scss'

export default class UserDropMenus extends PureComponent {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
  }

  handleSignOutClick = (e) => {
    const { signOut, onRequestClose } = this.props
    onRequestClose && onRequestClose(e)
    signOut()
  }

  render () {
    const { i18n, onRequestClose } = this.props
    return <Popover onRequestClose={onRequestClose} open
      className={classes.dropmenu}>
      <ul className={classes.menus}>
        <li>
          <Link className={classes.item} to='/settings/user'
            onClick={onRequestClose}>
            <i className='icon icon-user' />
            <span>{i18n('个人设置')}</span>
          </Link>
        </li>
        <li>
          <a className={classes.item} href='#' onClick={onRequestClose}>
            <i className='icon icon-settings' />
            <span>{i18n('系统管理')}</span>
          </a>
        </li>
        <li>
          <a className={classes.item} onClick={this.handleSignOutClick}>
            <i className='icon icon-logout' />
            <span>{i18n('退出登录')}</span>
          </a>
        </li>
      </ul>
    </Popover>
  }
}
