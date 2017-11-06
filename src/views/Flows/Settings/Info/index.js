import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'

import classes from './info.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  const { flow } = state
  return {
    name: flowId,
    envs: flow.getIn(['data', flowId, 'envs'], new Map()),
  }
}

export class FlowBaseInfo extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    envs: ImmutablePropTypes.map.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language)
  }

  render () {
    const { i18n, name, envs } = this.props
    return <table className={classes.table}>
      <tbody>
        <tr>
          <td>
            {i18n('FLOW_NAME')}
          </td>
          <td>
            {name}
          </td>
        </tr>
        <tr>
          <td>{i18n('FLOW_GIT_SOURCE')}</td>
          <td>
            {i18n(`GIT.${envs.get('FLOW_GIT_SOURCE')}`)}
          </td>
        </tr>
        <tr>
          <td>{i18n('FLOW_GIT_URL')}</td>
          <td>
            {envs.get('FLOW_GIT_URL')}
          </td>
        </tr>
        <tr>
          <td>{i18n('FLOW_GIT_WEBHOOK')}</td>
          <td>
            {envs.get('FLOW_GIT_WEBHOOK')}
          </td>
        </tr>
        <tr>
          <td>{i18n('FLOW_AGENT_WORKSPACE')}</td>
          <td>
            {envs.get('FLOW_AGENT_WORKSPACE')}
          </td>
        </tr>
        <tr>
          <td>{i18n('FLOW_GIT_CREDENTIAL')}</td>
          <td>
            {envs.get('FLOW_GIT_CREDENTIAL')}
          </td>
        </tr>
      </tbody>
    </table>
  }
}

export default connect(mapStateToProps)(FlowBaseInfo)
