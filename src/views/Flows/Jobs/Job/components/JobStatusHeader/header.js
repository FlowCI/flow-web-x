import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import classes from './header.scss'

function mapStateToProps (state, { id }) {
  const { job } = state
  return {
    job: job.getIn(['data', id])
  }
}

export class JobStatusHeader extends Component {
  static propTypes = {
    job: ImmutablePropTypes.map,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { job, i18n } = this.props
    return <div className={`${classes.header} ${job.get('status', '')}`}>
      <span className={classes.icon}>
        <i className='icon icon-check' />{i18n('构建成功')}
      </span>
      <ul className={classes.list}>
        <li>{i18n('构建于4小时前', { time: job.get('startedAt') })}</li>
        <li>
          {i18n('花费43秒', { start: job.get('startedAt'),
            finish: job.get('finishedAt')
          })}
        </li>
        <li>{i18n('手动构建')}</li>
      </ul>
    </div>
  }
}

export default connect(mapStateToProps)(JobStatusHeader)
