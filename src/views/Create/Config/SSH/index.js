import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'

import Input from 'components/Form/Input'
import IconButton from 'components/IconButton'
import Loading from 'components/Loading'

import classes from './ssh.scss'

function mapStateToProps (state, { flowId }) {
  const { flow } = state
  return {
    flow: flow.getIn(['data', flowId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    done: actions.updateEnv,
    test: function () {},
    redirect: push,
  }, dispatch)
}

export class SSHConfig extends Component {
  static propTypes = {
    flow: ImmutablePropTypes.map,

    done: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  renderContent () {
    const { i18n, flow } = this.props
    return <div>
      <section className={classes.section}>
        <h5 className={classes.title}>
          {i18n('输入 Git 仓库地址')}
          <IconButton className={classes.question}>
            <i className='icon icon-question-thin' />
          </IconButton>
        </h5>
        <Input className={classes.addr}
          placeholder={i18n('例：git@github.com:FlowCI/flow-platform.git')} />
      </section>
      <section className={classes.section}>
        <h5 className={classes.title}>
          {i18n('手动添加 WebHook 地址到你的 Git 仓库')}
          <IconButton className={classes.question}>
            <i className='icon icon-question-thin' />
          </IconButton>
        </h5>
        <code className={classes.code}>
          {flow.getIn(['env', 'FLOW_GIT_WEBHOOK'])}
        </code>
      </section>
      <section className={classes.section}>
        <h5 className={classes.title}>
          {i18n('Deploy Key（可选）')}
          <IconButton className={classes.question}>
            <i className='icon icon-question-thin' />
          </IconButton>
          <small className={classes.subTitle}>
            {i18n('如没有 Git 仓库访问权限，请添加 Deploy Key 到 Git 仓库的项目或者用户设置')}
          </small>
        </h5>
      </section>
    </div>
  }

  render () {
    const { flow } = this.props
    return flow ? this.renderContent() : <div>
      <Loading />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSHConfig)
