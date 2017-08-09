import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'react-router'
import { push } from 'react-router-redux'

import { FlowCard, AgentsCard, UserCard, Card } from './Card'

import classes from './navbar.scss'

function mapStateToProps (state, props) {
  const { session } = state
  return {
    authored: session.includes('user'),
    avatar: session.getIn(['user', 'avatar']),
    backUrl: '',
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
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

    redirect: PropTypes.func.isRequired,

    i18n: PropTypes.func.isRequired,
  }

  state = {
    openFlows: false,
    openAgents: false,
    openMenus: false,
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

  handleBack = (e) => {
    const { redirect, backUrl } = this.props
    redirect(backUrl)
  }

  renderBackButton () {
    const { i18n } = this.props

    return <Card containerClass={classes.backButton}
      className={classes.back}
      onActive={this.handleBack}>
      <i className='icon icon-keyboard_arrow_left' />
      {i18n('back')}
    </Card>
  }

  render () {
    const { authored, backUrl, i18n } = this.props
    const { openFlows, openAgents, openMenus } = this.state

    const contentClass = [classes.content]
    !authored && contentClass.push(classes.unauthored)

    return <div className={classes.navbar}>
      <Link className={classes.logo} to='/'>
        <i className='icon icon-logo' />
      </Link>
      <div className={contentClass.join(' ')}>
        {authored && (backUrl ? this.renderBackButton()
          : <FlowCard i18n={i18n} active={openFlows}
            onActive={this.openFlows}
            onRequestClose={this.closeFlows}
          />)}
        <ul className={classes.navs}>
          {authored && <li>
            <AgentsCard active={openAgents} i18n={i18n}
              onActive={this.openAgents}
              onRequestClose={this.closeAgents}
            />
          </li>}
          <li>
            <Card href='//docs.flow.ci' target='_blank'>
              <i className='icon icon-question' />
            </Card>
          </li>
          {authored && <li>
            <UserCard active={openMenus} i18n={i18n}
              onActive={this.openUserMenus}
              onRequestClose={this.closeUserMenus}
            />
          </li>}
        </ul>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
