import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Editor from 'components/CodeEditor'
import Button from 'components/Buttonx'

import classes from './script.scss'

export default class FlowStepScript extends Component {
  static propTypes = {
    script: PropTypes.string.isRequired,

    save: PropTypes.func.isRequired,
  }

  state = {
    script: this.props.script
  }

  componentWillReceiveProps (nextProps) {
    const { script } = nextProps
    if (this.props.script !== script) {
      this.setState({ script })
    }
  }

  handleSave = () => {
    const { save } = this.props
    const { script } = this.state
    return save(script)
  }

  handleChange = (v) => {
    this.setState({ script: v })
  }

  reset = () => {
    this.setState({ script: this.props.script })
  }

  render () {
    const { script } = this.state
    const changed = this.props.script !== script

    return <div className={classes.editor}>
      <Editor className={classes.script} value={script}
        language='powershell'
        onChange={this.handleChange} />
      <Button type='secondary' disabled={!changed}
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
