import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import { FlowCard, AgentsCard, UserCard, Card } from './Card'

import classes from './navbar.scss'

function mapStateToProps (state, props) {
  const { session: { user } } = state
  return {
    authored: !user,
    avatar: user ? user.avatar : '',
  }
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

    i18n: PropTypes.func.isRequired,
  }

  state = {
    openFlows: false,
    openAgents: false,
    openMenus: false
  }

  createOpenHandler (stateName) {
    return (e) => {
      this.setState({ [stateName]: true })
    }
  }

  createCloseHandler (stateName) {
    return () => {
      this.setState({ [stateName]: false })
    }
  }

  openFlows = this.createOpenHandler('openFlows')

  closeFlows = this.createCloseHandler('openFlows')

  openAgents = this.createOpenHandler('openAgents')

  closeAgents = this.createCloseHandler('openAgents')

  openUserMenus = this.createOpenHandler('openMenus')

  closeUserMenus = this.createCloseHandler('openMenus')

  renderBackButton () {
    const { i18n, backUrl } = this.props
    const cls = [classes.backButton]

    return <Link to={backUrl} className={cls.join(' ')}>
      <i className='icon icon-keyboard_arrow_left' />
      {i18n('back')}
    </Link>
  }

  render () {
    const { backUrl, i18n } = this.props
    const { openFlows, openAgents, openMenus } = this.state

    return <div className={classes.navbar}>
      <Link className={classes.logo} to='/'>
        <i className='icon icon-logo' />
      </Link>
      <div className={classes.content}>
        {backUrl ? this.renderBackButton()
          : <FlowCard i18n={i18n} active={openFlows}
            onActive={this.openFlows}
            onRequestClose={this.closeFlows}
          />}
        <ul className={classes.navs}>
          <li>
            <AgentsCard active={openAgents} i18n={i18n}
              onActive={this.openAgents}
              onRequestClose={this.closeAgents}
            />
          </li>
          <li>
            <Card href='//docs.flow.ci' target='_blank'>
              <i className='icon icon-question' />
            </Card>
          </li>
          <li>
            <UserCard active={openMenus} i18n={i18n}
              onActive={this.openUserMenus}
              onRequestClose={this.closeUserMenus}
            />
          </li>
        </ul>
      </div>
    </div>
  }
}

export default connect(mapStateToProps)(Navbar)
