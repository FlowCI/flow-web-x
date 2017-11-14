import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Navbar from '../../components/Navbar'
import { FlowCard, AgentsCard, UserCard, Card } from './Card'

import classes from './navbar.scss'

function mapStateToProps (state, props) {
  const { session, ui } = state
  return {
    authored: !!session.get('user'),
    avatar: session.getIn(['user', 'avatar']),
    backUrl: ui.get('backUrl'),
  }
}

export class PageLayoutNavbar extends PureComponent {
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
    backUrl: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    locationKey: PropTypes.any,

    i18n: PropTypes.func.isRequired,
  }

  state = {
    openFlows: false,
    openAgents: false,
    openMenus: false,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.locationKey !== nextProps.locationKey) {
      this.setState({ openFlows: false, openAgents: false, openMenus: false })
    }
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

    return <Card containerClass={classes.backButton}
      className={classes.back} to={backUrl}>
      <i className='icon icon-arrow-left' />
      {i18n('返回')}
    </Card>
  }

  render () {
    const { authored, backUrl, i18n } = this.props
    const { openFlows, openAgents, openMenus } = this.state

    const contentClass = [classes.content]
    !authored && contentClass.push(classes.unauthored)

    return <Navbar>
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
    </Navbar>
  }
}

export default connect(mapStateToProps)(PageLayoutNavbar)
