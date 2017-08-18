import React, { Component } from 'react'
import { string, func, bool } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'

import Loading from 'components/Loading'

import HTTPConfig from './HTTP'
import SSHConfig from './SSH'

import classes from './config.scss'

const Enums = {
  SSH: SSHConfig,
  HTTP: HTTPConfig,
}
const EnumKeys = Object.keys(Enums)

function mapStateToProps (state, { params: { flowId } }) {
  const { flow } = state
  return {
    flowId,
    loaded: flow.hasIn(['data', flowId]),
    // isNotFound: flow.getIn(['ui', flowId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.get,
    redirect: push,
  }, dispatch)
}

export class ConfigFlowView extends Component {
  static propTypes = {
    loaded: bool,
    flowId: string.isRequired,

    get: func.isRequired,
    redirect: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  state = {
    choose: EnumKeys[0]
  }

  componentDidMount () {
    const { loaded, get, flowId } = this.props
    if (!loaded) {
      get(flowId)
    }
  }

  redirectToNotFound () {
    const { redirect } = this.props
    redirect('/notfound')
  }

  createHandle (path) {
    return (e) => {
      e.preventDefault()
      this.setState({ choose: path })
    }
  }

  renderNav = (path) => {
    const { choose } = this.state
    const cls = [classes.nav]
    choose === path && cls.push(classes.active)
    return <a href='#' key={path} className={cls.join(' ')}
      onClick={this.createHandle(path)}
    >
      {path}
    </a>
  }

  renderChild () {
    const { flowId, i18n } = this.props
    const { choose } = this.state
    const child = Enums[choose]
    return React.createElement(child, {
      flowId,
      i18n: i18n.createChild(choose),
    })
  }

  render () {
    const { loaded } = this.props
    return <div className={classes.container}>
      <div className={classes.navbar}>
        {EnumKeys.map(this.renderNav)}
      </div>
      {loaded ? this.renderChild() : <div>
        <Loading />
      </div>}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigFlowView)
