import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { iterable } from 'react-immutable-proptypes'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/system'

import Loading from 'components/Loading'
import { Select, Option } from 'components/Form/Select'
import Title from '../components/Title'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
  ListCol,
} from '../components/List'
import Services from './service'
import classes from './system.scss'

function mapStateToProps (state, props) {
  const { system } = state
  const list = system.get('list')
  const data = system.get('data')
  return {
    loading: system.getIn(['ui', 'QUERY']) !== STATUS.success,
    systems: list.map((name) => data.get(name))
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    freedAll: actions.freedAll,
  }, dispatch)
}

export class AdminSystemInfos extends Component {
  static propTypes = {
    loading: bool,
    systems: iterable.isRequired,

    query: func.isRequired,
    freedAll: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  state = {
    system: 'api'
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  componentWillUnmount () {
    const { freedAll } = this.props
    freedAll()
  }

  selectSystem = (v) => {
    this.setState({ system: v })
  }

  renderSystemInfo () {
    const { systems, i18n } = this.props
    return <div className={classes.section}>
      <h5 className={classes.title}>
        {i18n('系统版本')}
      </h5>
      <List>
        <ListHead>
          <ListRow>
            <ListHeadCol>名称</ListHeadCol>
            <ListHeadCol>当前版本</ListHeadCol>
            <ListHeadCol>最新版本</ListHeadCol>
          </ListRow>
        </ListHead>
        <ListBody>
          {systems.map((system) => {
            return <ListRow key={system.get('name')}>
              <ListCol>{system.get('name')}</ListCol>
              <ListCol>{system.get('version')}</ListCol>
              <ListCol>最新版本</ListCol>
            </ListRow>
          })}
        </ListBody>
      </List>
    </div>
  }

  renderContent () {
    const { i18n } = this.props
    const { system } = this.state
    return <div>
      {this.renderSystemInfo()}
      <Select value={system} onChange={this.selectSystem}
        className={classes.dropdown}>
        <Option value='api' title='API 信息' />
        <Option value='cc' title='Control Center' />
      </Select>
      <Services system={system} i18n={i18n} />
    </div>
  }

  render () {
    const { loading, i18n } = this.props
    return <div>
      <Title title={i18n('title')} subTitle={i18n('subTitle')} />
      {loading ? <Loading /> : this.renderContent() }
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSystemInfos)
