import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import { connect } from 'react-redux'

import classes from './jobItem.scss'

function mapStateToProps (state, { id }) {
  const { job } = state

  return {
    job: job.getIn(['data', id])
  }
}

export class JobItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    job: ImmutablePropTypes.map.isRequired,

    onClick: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  handleClick = () => {
    const { onClick, id, job } = this.props
    onClick(id, job)
  }

  renderItem (name, value) {
    return <div className={classes.item}>
      <span className={classes.name}>{name}</span>
      <span className={classes.value}>{value}</span>
    </div>
  }

  render () {
    const { job, i18n } = this.props
    const outputs = job.get('outputs', new Map())
    return <div className={classes.job} onClick={this.handleClick}>
      <span className={classes.icon}>
        <i className='icon icon-check' />
        {i18n('构建成功')}
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
          {this.renderItem(i18n('Commit'), '-')}
          {this.renderItem(i18n('Compare'), '-')}
        </div>
        <div className={classes.itemRow}>
          {this.renderItem(i18n('Builded'), '1小时前')}
          {this.renderItem(i18n('Duration'), '20秒')}
        </div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps)(JobItem)
