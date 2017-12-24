import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Editor from 'components/CodeEditor'
import Button from 'components/Buttonx'
import Input from 'rc-components/Input'

import classes from './script.scss'

export default class CustomScript extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
  }

  state = {
    script: '',
    name: '',
  }

  handleNameChange = (v) => {
    this.setState({ name: v })
  }

  handleChange = (v) => {
    this.setState({ script: v })
  }

  save = () => {
    const { save } = this.props
    const { name, script } = this.state
    return save(name, script)
  }

  render () {
    const { name, script } = this.state
    return <div className={classes.container}>
      <Input className={classes.input} placeholder='输入脚本名'
        value={name} onChange={this.handleNameChange} />
      <Editor className={classes.editor}
        value={script} onChange={this.handleChange} />
      <Button type='primary' onClick={this.save}>保存</Button>
    </div>
  }
}
