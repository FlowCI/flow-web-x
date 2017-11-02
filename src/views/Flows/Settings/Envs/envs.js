import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Header from '../components/Header'

import Form from './form'
import Env from './env'
import classes from './envs.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  return {
    envs: new Map({ key: 'value1', key2: 'value2' }),
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    update: function () {}
  }, dispatch)
}

export class FlowEnvsSetting extends Component {
  static propTypes = {
    // flowId: PropTypes.string.isRequired,
    envs: ImmutablePropTypes.map.isRequired,
    // update: PropTypes.func.isRequired,

  }

  render () {
    const { envs } = this.props
    return <div>
      <Header title='全局环境变量'
        subTitle='环境变量作用域为整个 flow 流程   查看帮助文档'>
        <Form className={classes.form} />
      </Header>
      <table className={classes.table}>
        <tbody>
          {envs.keySeq().map((key) => {
            const value = envs.get(key)
            return <Env key={key} name={key} value={value} />
          })}
        </tbody>
      </table>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowEnvsSetting)
