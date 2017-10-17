import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/system'

import {
  List as ListComponent,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
  ListCol,
} from '../components/List'

import JVM from './jvm'
import classes from './system.scss'

function mapStateToProps (state, props) {
  const { system } = props
  const { system: sys } = state

  return {
    services: sys.getIn(['services', system], new List())
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryServices: actions.queryServices,
  }, dispatch)
}

export class AdminServiceInfo extends Component {
  static propTypes = {
    system: PropTypes.string.isRequired,
    services: ImmutablePropTypes.list.isRequired,
    queryServices: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { system, services, queryServices } = this.props
    if (!services.size) {
      queryServices(system)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { system } = this.props
    const { system: nextSystem, services } = nextProps
    if (system !== nextSystem && !services.size) {
      const { queryServices } = nextProps
      queryServices(nextSystem)
    }
  }

  renderList () {
    const { services } = this.props
    return <ListComponent>
      <ListHead>
        <ListRow>
          <ListHeadCol>名称</ListHeadCol>
          <ListHeadCol>状态</ListHeadCol>
          <ListHeadCol>版本</ListHeadCol>
        </ListRow>
      </ListHead>
      <ListBody>
        {services.map((system) => {
          const name = system.get('name')
          return <ListRow key={name}>
            <ListCol>{name}</ListCol>
            <ListCol>{system.get('status')}</ListCol>
            <ListCol>{system.get('version')}</ListCol>
          </ListRow>
        })}
      </ListBody>
    </ListComponent>
  }

  renderJvm () {
    const { services, i18n } = this.props
    const jvm = services.find((it) => it.get('name') === 'Java(TM) SE Runtime Environment')
    if (jvm) {
      return <JVM jvm={jvm} i18n={i18n} />
    }
  }

  render () {
    const { i18n } = this.props
    return <div>
      <div className={classes.section}>
        <h5 className={classes.title}>
          {i18n('服务信息')}
        </h5>
        {this.renderList()}
      </div>
      {this.renderJvm()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminServiceInfo)
