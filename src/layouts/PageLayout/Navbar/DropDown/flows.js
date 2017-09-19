import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'
import autoCancel from 'react-promise-cancel'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/flow'
import { actions as jobActions } from 'redux/modules/job'

import Loading from 'components/Loading'
import IconButton from 'components/IconButton'
import Input from 'components/Form/Input'

import DropDown from './dropdown'
import FlowTab from '../components/flowtab'

import classes from './flows.scss'

const filterFlowsSelector = createSelector(
  (names, filter) => names,
  (names, filter) => filter,
  (names, filter) => {
    let filted = names
    if (filter) {
      const reg = new RegExp(filter.replace('\\', '\\\\'), 'i')
      filted = names.filter((name) => reg.test(name))
    }
    return filted
  }
)
function mapStateToProps (state, props) {
  const { flow } = state
  const status = flow.getIn(['ui', 'QUERY_LAST_JOBS'])

  const list = flow.get('list')
  const filter = flow.getIn(['ui', 'filter'])
  const query = flow.getIn(['ui', 'QUERY'])

  return {
    flowIds: filterFlowsSelector(list, filter),
    loaded: query === STATUS.success && (!list.size ||
      status === STATUS.success),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryLastJob: jobActions.queryLastest,
    setFilter: actions.setFilter,
    freedFilter: actions.freedFilter,
  }, dispatch)
}

export class NavbarFlowsDropdown extends PureComponent {
  static propTypes = {
    flowIds: ImmutablePropTypes.iterable.isRequired,
    loaded: PropTypes.bool,

    queryLastJob: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    setFilter: PropTypes.func.isRequired,
    freedFilter: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { flowIds } = this.props
    if (flowIds.size) {
      this.queryJobs()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { flowIds, loaded } = this.props
    const { flowIds: nextFlowIds } = nextProps
    if (!loaded && !flowIds.size && nextFlowIds.size) {
      this.queryJobs(nextProps)
    }
  }

  componentWillUnmount () {
    const { freedFilter } = this.props
    freedFilter()
  }

  queryJobs (props = this.props) {
    const { flowIds, queryLastJob } = props
    queryLastJob(flowIds.toArray())
  }

  handleSearch = (value) => {
    const { setFilter } = this.props
    setFilter(value)
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
        {i18n('我的 Flow')}<IconButton className={classes.plus}
          size='sm' to='/create'>
          <i className='icon icon-plus-sm' />
        </IconButton>
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
