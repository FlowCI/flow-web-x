import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import Input from 'components/Form/Input'

import classes from './envs.scss'

export default class FlowEnv extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.value,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  setFocus = () => {
    this.setState({ focus: true })
  }

  setBlur = () => {
    this.setState({ focus: false })
  }

  setInputFocus = () => {
    this.setState({ inputFocus: true })
  }

  setInputBlur = () => {
    this.setState({ inputFocus: false })
  }

  handleValueChange = (v) => {
    this.setState({ value: v })
  }

  handleSave = () => {
    const { name, save, value: v } = this.props
    const { value } = this.state
    if (value !== v) {
      return save(name, value)
    }
  }

  handleRemove = () => {
    const { remove, name } = this.props
    return remove(name)
  }

  renderActions () {
    const { value: v } = this.props
    const { focus, value } = this.state
    const pristine = value === v
    return <div className={classes.actions}>
      {!pristine && <Button className={classes.save}
        onClick={this.handleSave}>
        <i className='icon icon-check' />
      </Button>}
      {focus && <Button className={classes.remove}
        onClick={this.handleRemove}>
        <i className='icon icon-trash' />
      </Button>}
    </div>
  }

  render () {
    const { name } = this.props
    const { value } = this.state

    return <tr className={classes.env}
      onMouseEnter={this.setFocus}
      onMouseLeave={this.setBlur}
    >
      <td>{name}</td>
      <td>
        <Input value={value}
          className={classes.input}
          onChange={this.handleValueChange}
          onFocus={this.setInputFocus}
          onBlur={this.setInputBlur}
        />
        {this.renderActions()}
      </td>
    </tr>
  }
}
