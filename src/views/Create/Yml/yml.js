import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'
import Editor from 'components/CodeEditor'
import Button from 'components/Button'

import classes from './yml.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  return {
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    save: actions.saveYml,
    redirect: push,
  }, dispatch)
}

export class FlowYmlSetting extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  state = {
    text: ''
  }

  handleEditorChange = (e) => {
    this.setState({ text: e.target.value })
  }

  handleSave = () => {
    const { flowId, save, redirect } = this.props
    const { text } = this.state
    return save(flowId, text).then(() => {
      redirect(`/flows/${flowId}`)
    })
  }

  render () {
    const { text } = this.state
    return <div className={classes.container}>
      <div className={classes.editorwrap}>
        <div className={classes.header}>.flow.ci</div>
        <Editor className={classes.editor} value={text}
          onChange={this.handleEditorChange} placeholder='请填写 yml 内容' />
      </div>
      <Button className={classes.save} onClick={this.handleSave}>
        保存
      </Button>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowYmlSetting)
