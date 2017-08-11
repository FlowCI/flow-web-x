import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'
import autoCancel from 'react-redux-http'

import { actions } from 'redux/modules/flow'

import Loading from 'components/Loading'
import Input from 'components/Form/Input'

import DropDown from './dropdown'
import FlowTab from '../internal/flowtab'

import classes from './flows.scss'

function mapStateToProps (state, props) {
  const { flow } = state
  return {
    flowIds: flow.get('list'),
    loaded: flow.getIn(['ui', 'query']) > STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
  }, dispatch)
}

export class NavbarFlowsDropdown extends PureComponent {
  static propTypes = {
    flowIds: ImmutablePropTypes.iterable.isRequired,
    loaded: PropTypes.bool,

    query: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  handleSearch = (e) => {
    const { target: { value } } = e
    console.log('search flow', value)
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
          onPressEnter={this.handleSearch}
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
  autoCancel({ funcs: ['query'] })(NavbarFlowsDropdown)
)
