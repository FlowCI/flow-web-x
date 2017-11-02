import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Editor from 'components/CodeEditor'
import Header from '../components/Header'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  return {
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    update: function () { }
  }, dispatch)
}

export class FlowYmlSetting extends Component {
  static propTypes = {
    yml: PropTypes.string,
    flowId: PropTypes.string.isRequired,
  }

  render () {
    return <div>
      <Header title='配置 yml 工作流'
        subTitle='点击查看 yml 文件编写文档（内含 Demo）' />
      <Editor />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowYmlSetting)
