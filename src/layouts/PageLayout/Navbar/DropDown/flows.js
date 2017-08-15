import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'
import autoCancel from 'react-redux-http'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/flow'

import Loading from 'components/Loading'
import Input from 'components/Form/Input'

import DropDown from './dropdown'
import FlowTab from '../components/flowtab'

import classes from './flows.scss'

const flowsSelector = createSelector(
  (state) => state.flow.get('list'),
  (state) => state.flow.get('data'),
  (ids, data) => ids.map((id) => data.get(id))
)

const filterFlowsSelector = createSelector(
  (flows, filter) => flows,
  (flows, filter) => filter,
  (flows, filter) => {
    let filted = flows
    if (filter !== undefined && filter !== '') {
      const reg = new RegExp(filter.replace('\\', '\\\\'), 'i')
      filted = flows.filter((flow) => {
        const name = flow.get('name')
        return reg.test(name)
      })
    }
    return filted.map((f) => f.get('id'))
  }
)
function mapStateToProps (state, props) {
  const { flow } = state
  const status = flow.getIn(['ui', 'QUERY_JOBS'])

  const flows = flowsSelector(state)
  const filter = flow.getIn(['ui', 'dropDownFilter'])
  return {
    flowIds: filterFlowsSelector(flows, filter),
    loaded:  status === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryLastJob: actions.queryLastJob,
    setDropDownFilter: actions.setDropDownFilter,
    freedDropDownFilter: actions.freedDropDownFilter,
  }, dispatch)
}

export class NavbarFlowsDropdown extends PureComponent {
  static propTypes = {
    flowIds: ImmutablePropTypes.iterable.isRequired,
    loaded: PropTypes.bool,

    queryLastJob: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    setDropDownFilter: PropTypes.func.isRequired,
    freedDropDownFilter: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { flowIds } = this.props
    if (flowIds.size) {
      this.queryJobs()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { flowIds } = this.props
    const { flowIds: nextFlowIds } = nextProps
    if (!flowIds.size && nextFlowIds.size) {
      this.queryJobs(nextProps)
    }
  }

  componentWillUnmount () {
    const { freedDropDownFilter } = this.props
    freedDropDownFilter()
  }

  queryJobs (props = this.props) {
    const { flowIds, queryLastJob } = props
    queryLastJob(flowIds.toArray())
  }

  handleSearch = (e) => {
    const { target: { value } } = e
    const { setDropDownFilter } = this.props
    setDropDownFilter(value)
  }

  renderFlows () {
    const { flowIds } = this.props
    return flowIds.map((id) => <FlowTab key={id} id={id} />)
  }

  renderContent () {
    const { i18n } = this.props
    return <div>
      <div className={classes.search}>
        <Input className='block'
          onChange={this.handleSearch}
          leftIcon={<i className='icon icon-search' />}
          placeholder={i18n('输入关键词搜索')}
        />
      </div>
      <hr />
      <div className={classes.header}>
        {i18n('我的 Flow')}
      </div>
      <div className={classes.flows}>
        {this.renderFlows()}
      </div>
    </div>
  }

  renderLoading () {
    return <div className={classes.paddingWrap}>
      <Loading />
    </div>
  }

  render () {
    const { loaded } = this.props
    return <DropDown className={classes.content} arrowClass={classes.arrow}>
      {loaded ? this.renderContent() : this.renderLoading()}
    </DropDown>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['queryLastJob'] })(NavbarFlowsDropdown)
)
