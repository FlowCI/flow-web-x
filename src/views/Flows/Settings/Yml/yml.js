import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/flow'
import Editor from 'components/CodeEditor'
import Button from 'components/Button'
import Header from '../components/Header'

import classes from './yml.scss'
function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  const { flow } = state
  return {
    yml: flow.getIn(['yml', flowId], ''),
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    get: actions.getYml,
    save: actions.saveYml,
  }, dispatch)
}

export class FlowYmlSetting extends Component {
  static propTypes = {
    yml: PropTypes.string,
    flowId: PropTypes.string.isRequired,
    get: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  }

  state = {
    text: this.props.yml || ''
  }

  componentDidMount () {
    const { yml, flowId, get } = this.props
    if (!yml && yml !== '') {
      get(flowId)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.yml !== nextProps.yml) {
      this.setState({ text: nextProps.yml })
    }
  }

  handleEditorChange = (e) => {
    this.setState({ text: e.target.value })
  }

  handleSave = () => {
    const { flowId, save } = this.props
    const { text } = this.state
    return save(flowId, text)
  }

  render () {
    const { yml } = this.props
    const { text } = this.state
    return <div>
      <Header title='配置 yml 工作流'
        subTitle='点击查看 yml 文件编写文档（内含 Demo）' />
      <div className={classes.editorwrap}>
        <Editor className={classes.editor} value={text}
          onChange={this.handleEditorChange} />
        <Button className='btn-primary' disabled={yml === text}
          onClick={this.handleSave}
        >
          保存
        </Button>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowYmlSetting)
