import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/step'
import { push } from 'react-router-redux'

import Button from 'components/Buttonx'
import { Tabs, Tab } from './Tabs'
import Plugins from '../Plugins'
import Script from './script'

import classes from './add.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  return {
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    addCustomStep: actions.addCustomStep,
    redirect: push,
  }, dispatch)
}

export class AddInstalledPlugin extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    addCustomStep: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,

  }
  state = {
    tab: 'plugin',
  }

  handleTabChange = (v) => {
    this.setState({ tab: v })
  }

  handleScriptSave = (name, script) => {
    const { flowId, addCustomStep, redirect } = this.props
    return addCustomStep(flowId, name, script).then((resp) => {
      const data = resp.data
      const name = encodeURIComponent(data[data.length - 1].name)
      redirect(`/flows/${flowId}/settings/editor/plugin/${name}`)
    })
  }

  renderPlugins () {
    const { flowId } = this.props
    return <Plugins flowId={flowId} />
  }

  renderScript () {
    return <Script save={this.handleScriptSave} />
  }

  render () {
    const { tab } = this.state
    return <div className={classes.panel}>
      <div className={classes.header}>
        <Tabs className={classes.tabs} value={tab}
          onChange={this.handleTabChange}>
          <Tab value='plugin'>已安装插件</Tab>
          <Tab value='script'>使用自定义脚本</Tab>
        </Tabs>
        <Button type='danger' plain>取消添加</Button>
      </div>
      {tab === 'plugin' ? this.renderPlugins() : this.renderScript()}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddInstalledPlugin)
