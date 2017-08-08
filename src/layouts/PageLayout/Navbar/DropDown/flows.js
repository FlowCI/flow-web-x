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
    flows: flow.get('data'),
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
    flows: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
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

  getFlows () {
    const { flows } = this.props
    return flows
  }

  renderFlows () {
    const flows = this.getFlows()
    return flows.map((flow) => <FlowTab key={flow.get('path')}
      name={flow.get('name')} status={flow.get('status')}
      path={flow.get('path')}
    />)
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
