import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/session'

import { Link } from 'react-router'
import DropDown from './dropdown'

import classes from './user.scss'

function mapStateToProps (state, props) {
  const { session } = state
  const isAdmin = session.getIn(['user', 'isAdmin'], false)
  console.log(isAdmin)
  return {
    isAdmin,
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signOut: actions.signOut,
  }, dispatch)
}

export class UserDropMenus extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool,
    onRequestClose: PropTypes.func,
    signOut: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  handleSignOutClick = (e) => {
    const { signOut, onRequestClose } = this.props
    onRequestClose && onRequestClose(e)
    signOut()
  }

  render () {
    const { isAdmin, i18n } = this.props
    return <DropDown className={classes.dropmenu} arrowClass={classes.arrow}>
      <ul className={classes.menus}>
        <li>
          <Link className={classes.item} to='/settings/user'>
            <i className='icon icon-user' />
            <span>{i18n('个人设置')}</span>
          </Link>
        </li>
        {isAdmin && <li>
          <Link className={classes.item} to='/admin'>
            <i className='icon icon-settings' />
            <span>{i18n('系统管理')}</span>
          </Link>
        </li>}
        <li>
          <a className={classes.item} onClick={this.handleSignOutClick}>
            <i className='icon icon-logout' />
            <span>{i18n('退出登录')}</span>
          </a>
        </li>
      </ul>
    </DropDown>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDropMenus)
