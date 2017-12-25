import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Button from 'components/Buttonx'
import Item from './item'

export default class ConfigPlugin extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,
    envs: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    envs: {}
  }

  state = {
    envs: this.props.envs,
    errors: {}
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.envs !== nextProps.envs) {
      this.setState({ envs: nextProps.envs, errors: {} })
    }
  }

  checkEnvs = (envs) => {
    const { plugin } = this.props
    const items = plugin.getIn(['detail', 'properties'])
    const errors = {}
    items.forEach((item) => {
      const required = item.get('required')
      const name = item.get('name')
      const value = envs[name]
      if (!!value || !required) {
        errors[name] = 'requqired'
      }
    })
    return errors
  }

  handelValueChange = (name, value) => {
    const { envs } = this.state
    const nextEnvs = { ...envs, [name]: value }
    const errors = this.checkEnvs(nextEnvs)
    this.setState({ envs: nextEnvs, errors })
  }

  handleSave = () => {
    const { save, plugin } = this.props
    const { envs } = this.state
    return save(plugin, envs)
  }

  handleCancel = () => {
    const { cancel } = this.props
    cancel()
  }

  render () {
    const { plugin } = this.props
    const { envs, errors } = this.state
    const items = plugin.getIn(['detail', 'properties'])

    return <div>
      {items.map((item) => {
        const name = item.get('name')
        return <Item key={item.get('name')}
          item={item} invalid={!!errors[name]}
          value={envs[name]}
          onChange={this.handelValueChange}
        />
      })}
      <div>
        <Button type='primary' onClick={this.handleSave}>保存</Button>
        <Button type='text' onClick={this.handleCancel}>取消</Button>
      </div>
    </div>
  }
}
