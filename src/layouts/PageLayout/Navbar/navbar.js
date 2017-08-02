import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/session'

import { Link } from 'react-router'
import Arrow from 'components/Arrow'

import UserDropMenus from './userMenus'

import classes from './navbar.scss'

function mapStateToProps (state, props) {
  const { session: { user } } = state
  return {
    authored: !user,
    avatar: user ? user.avatar : '',
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signOut: actions.signOut
  }, dispatch)
}

export class Navbar extends PureComponent {
  static propTypes = {
    /*
      if false, it will only show question icon
    */
    authored: PropTypes.bool,
    /*
      if avatar addr is invalid, it will show default avatar
    */
    // avatar: PropTypes.string, // wait for use

    /*
      if backUrl isnt empty, the brand will hide and show back button
    */
    backUrl: PropTypes.string,

    // onFlowIconClick: PropTypes.func.isRequired,
    // onAgentIconClick: PropTypes.func.isRequired,

    signOut: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    openFlows: false,
    openAgents: false,
    openMenus: false
  }

  createClickHandler (stateName) {
    return (e) => {
      e.preventDefault() // stop redirect
      this.setState({ [stateName]: !this.state[stateName] })
    }
  }

  createCloseHandler (stateName) {
    return () => {
      this.setState({ [stateName]: false })
    }
  }

  clickFlows = this.createClickHandler('openFlows')

  closeFlows = this.createCloseHandler('openFlows')

  clickAgents = this.createClickHandler('openAgents')

  closeAgents = this.createCloseHandler('openAgents')

  clickUserMenus = this.createClickHandler('openMenus')

  closeUserMenus = this.createCloseHandler('openMenus')

  renderFlowsButton () {
    const { authored, i18n } = this.props
    const { opened } = this.state
    const cls = [classes.flowsButton]
    !authored && cls.push('invisible')
    opened && cls.push(classes.active)

    return <a href='#' className={cls.join(' ')}>
      <i className='icon icon-branches' />
      <span>{i18n('Flow')}</span>
      <Arrow up={opened} className={classes.arrow} />
    </a>
  }

  renderBackButton () {
    const { i18n, backUrl } = this.props
    const cls = [classes.backButton]

    return <Link to={backUrl} className={cls.join(' ')}>
      <i className='icon icon-keyboard_arrow_left' />
      {i18n('back')}
    </Link>
  }

  renderAgentsButton () {
    const { authored } = this.props
    if (authored) {
      const opened = false
      const cls = [classes.card]
      opened && cls.push(classes.active)
      return <li>
        <a href='#' className={cls.join(' ')}>
          <i className='icon icon-agents' />
        </a>
      </li>
    }
  }

  renderUserButton () {
    const { authored } = this.props
    if (authored) {
      const opened = this.state.userMenus
      const cls = [classes.card]
      opened && cls.push(classes.active)
      return <li>
        <a className={cls.join(' ')} >
          <i className='icon icon-user' />
        </a>
      </li>
    }
  }

  render () {
    const { backUrl } = this.props
    const { userMenus } = this.state
    return <div className={classes.navbar}>
      <Link className={classes.logo} to='/'>
        <i className='icon icon-logo' />
      </Link>
      <div className={classes.content}>
        {backUrl ? this.renderBackButton() : this.renderFlowsButton()}
        <ul className={classes.navs}>
          {this.renderAgentsButton()}
          <li>
            <a className={classes.card} href='//docs.flow.ci'
              target='_blank' rel='noopener'>
              <i className='icon icon-question' />
            </a>
          </li>
          {this.renderUserButton()}
        </ul>
      </div>
      {userMenus && <UserDropMenus i18n={this.props.i18n}
        signOut={this.props.signOut} onRequestClose={this.closeUserMenus} />}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
