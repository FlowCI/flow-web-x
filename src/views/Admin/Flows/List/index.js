import React, { Component } from 'react'
import { func, string } from 'prop-types'
import { iterable } from 'react-immutable-proptypes'

import createI18n from '../i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/flow'

import Input from 'components/Form/Input'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
} from '../../components/List'

import {
  TabBars,
  Tab
} from '../../components/TabBars'

import FlowItem from './flow'

import classes from './flows.scss'

const filterFlowsSelector = createSelector(
  (ids, filter) => ids,
  (ids, filter) => filter,
  (ids, filter) => {
    let filted = ids
    if (filter) {
      const reg = new RegExp(filter.replace('\\', '\\\\'), 'i')
      filted = ids.filter((id) => reg.test(id))
    }
    return filted
  }
)

function mapStateToProps (state, props) {
  const { flow } = state
  const list = flow.get('list')
  const filter = flow.getIn(['ui', 'filter'])

  return {
    flowIds: filterFlowsSelector(list, filter),
    filter,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setFilter: actions.setFilter,
    freedFilter: actions.freedFilter,
  }, dispatch)
}

export class AdminFlowList extends Component {
  static propTypes = {
    flowIds: iterable.isRequired,
    filter: string,
    setFilter: func.isRequired,
    freedFilter: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('list'),
    filter: '',
  }

  componentWillUnmount () {
    const { freedFilter } = this.props
    freedFilter()
  }

  handleSearchChange = (value) => {
    const { setFilter } = this.props
    setFilter(value)
  }

  renderListHeader () {
    return <ListHead>
      <ListRow>
        <ListHeadCol className={classes.name}>
          Flow
        </ListHeadCol>
        <ListHeadCol className={classes.author}>
          创建人
        </ListHeadCol>
        <ListHeadCol className={classes.createTime}>
          创建时间
        </ListHeadCol>
        <ListHeadCol className={classes.webhook}>
          Webhook 地址
        </ListHeadCol>
        <ListHeadCol className={classes.deploy}>
          Deploy Key
        </ListHeadCol>
      </ListRow>
    </ListHead>
  }

  renderFlows () {
    const { flowIds, i18n } = this.props
    return <ListBody>
      {flowIds.map((id) => <FlowItem key={id} flowId={id} i18n={i18n} />)}
    </ListBody>
  }

  renderToolBars () {
    const { i18n, filter, flowIds } = this.props
    return <div className={classes.toolbar}>
      <TabBars value='all'>
        <Tab text={i18n('toolbar.all', { count: flowIds.size })} value='all' />
      </TabBars>
      <Input className={classes.search} placeholder='搜索'
        leftIcon={<i className='icon icon-search2' />}
        value={filter} onChange={this.handleSearchChange}
      />
    </div>
  }

  render () {
    return <div>
      {this.renderToolBars()}
      <div className={classes.scroller}>
        <List className={classes.flows}>
          {this.renderListHeader()}
          {this.renderFlows()}
        </List>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminFlowList)
