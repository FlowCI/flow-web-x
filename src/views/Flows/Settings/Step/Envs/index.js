import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import Button from 'components/Buttonx'
import Control from '../Control'

import classes from './envs.scss'

export default class FlowStepEnvs extends Component {
  static propTypes = {
    properties: ImmutablePropTypes.list.isRequired,
    values: ImmutablePropTypes.map.isRequired,
    save: PropTypes.func.isRequired,
  }

  static defaultProps = {
    values: new Map(),
    save: function () {}
  }

  state = {
    values: this.props.values,
    errors: this.validate(this.props.properties, this.props.values),
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.values !== nextProps.values) {
      this.setState({
        values: nextProps.values,
        errors: this.validate(nextProps.properties, nextProps.values),
      })
    }
  }

  validate (properties, values) {
    const errors = {}
    properties.forEach((prop) => {
      const name = prop.get('name')
      const required = prop.get('required')
      if (!(values.get(name) || !required)) {
        errors[name] = 'required'
      }
    })
    return errors
  }

  handleChange = (name, value) => {
    const { values } = this.state
    const nextValues = values.set(name, value)
    const errors = this.validate(this.props.properties, nextValues)
    this.setState({ values: nextValues, errors })
  }

  handleSave = () => {
    const { save } = this.props
    const { values } = this.state
    save(values)
  }

  reset = () => {
    const { values } = this.props
    this.setState({ values })
  }

  renderProperty = (prop) => {
    const { values, errors } = this.state
    const name = prop.get('name')
    const value = values.get(name, '')
    const invalid = !!errors[name]
    const desc = prop.get('description')
    const type = prop.get('type')
    const options = prop.get('values').toJS()

    return <div key={name} className={classes.env}>
      <div className={classes.label}>
        <span className={classes.strong}>{name}</span>
        <small className={classes.desc}>{desc}</small>
      </div>
      <Control type={type} name={name} className={classes.block}
        invalid={invalid} values={options} value={value}
        onChange={this.handleChange} />
    </div>
  }

  render () {
    const { properties, values: defaultValues } = this.props
    const { errors, values } = this.state

    const invalid = !Object.keys(errors)
    const changed = values !== defaultValues

    return <div className={classes.envs}>
      {properties.map(this.renderProperty)}
      <Button type='secondary' disabled={!changed || invalid}
        onClick={this.handleSave}>
        保存
      </Button>
      <Button type='text' disabled={!changed}
        onClick={this.reset}>
        取消
      </Button>
    </div>
  }
}
