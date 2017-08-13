import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import classes from './jobItem.scss'

function mapStateToProps (state, { id }) {
  const { job } = state

  return {
    job: job.getIn(['data', id])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push
  }, dispatch)
}

export class JobItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    job: ImmutablePropTypes.map.isRequired,

    i18n: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  renderItems () {

  }

  renderItem (name, value) {
    return <div className={classes.item}>
      <span className={classes.name}>{name}</span>
      <span className={classes.value}>{value}</span>
    </div>
  }

  render () {
    const { job } = this.props
    const outputs = job.get('outputs', new Map())
    return <div className={classes.job}>
      <span className={classes.icon}>
        <i className='icon icon-checked' />
        构建成功
      </span>
      <div className={classes.info}>
        <h4>
          #{job.get('number')}&nbsp;&nbsp;
          {outputs.getIn(['FLOW_GIT_BRANCH', 'value'])}
        </h4>
        <small>
          {outputs.getIn(['FLOW_GIT_CHANGELOG', 'value'])}
        </small>
      </div>
      <div className={classes.detail}>
        <div className={classes.itemRow}>
          {this.renderItem('Commit', '-')}
          {this.renderItem('Compare', '-')}
        </div>
        <div className={classes.itemRow}>
          {this.renderItem('Builded', '1小时前')}
          {this.renderItem('Duration', '20秒')}
        </div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobItem)
