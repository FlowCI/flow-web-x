import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { OrderedMap } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'

import Header from '../components/Header'

import Form from './form'
import Env from './env'
import classes from './envs.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  const { flow } = state
  return {
    envs: flow.getIn(['editEnvs', flowId], new OrderedMap()),
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.getEditEnvs,
    save: actions.saveEditEnvs,
    remove: actions.removeEditEnvs,
  }, dispatch)
}

export class FlowEnvsSetting extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    envs: ImmutablePropTypes.map.isRequired,
    query: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { query, flowId } = this.props
    query(flowId)
  }

  handleSave = (name, value) => {
    const { save, flowId } = this.props
    return save(flowId, { [name]: value })
  }

  handleRemove = (name) => {
    const { remove, flowId } = this.props
    return remove(flowId, name)
  }

  handleSubmit = ({ name, value }) => {
    return this.handleSave(name, value)
  }

  render () {
    const { envs } = this.props
    return <div>
      <Header title='全局环境变量' className={classes.formHeader}
        subTitle='环境变量作用域为整个 flow 流程   查看帮助文档'>
        <Form className={classes.form} onSubmit={this.handleSubmit} />
      </Header>
      <table className={classes.table}>
        <tbody>
          {envs.keySeq().map((key) => {
            const value = envs.get(key)
            return <Env key={key} name={key} value={value}
              save={this.handleSave} remove={this.handleRemove}
            />
          })}
        </tbody>
      </table>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowEnvsSetting)
