import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import createI18n from './i18n'
import language from 'util/language'

import { Steps, Step } from './Steps'
import { List, Item } from './List'

import classes from './guide.scss'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}

export class BuildGuide extends Component {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  renderSteps () {
    const { i18n } = this.props
    return <Steps>
      <Step title={i18n('在你的项目中添加 .flow.yml 配置文件')}>
        <List>
          <Item>
            <p>在根目录下添加 .flow.yml 文件。</p>
          </Item>
          <Item>
            <p>
              对于新创建的项目，flow.ci 会在根目录下自动查找 .flow.yml 项目配置文件，根据配置文件中定义的步骤，自动生成工作流。
            </p>
          </Item>
          <Item>
            <div>
              <p>如果在现有的项目中添加 .flow.yml，在收到 Push，Pull Request 等触发时，会根据配置文件自动更新工作流。</p>
              <a>点击查看 yml 文件编写规范</a>
            </div>
          </Item>
        </List>
      </Step>
      <Step title={i18n('通过 git push 触发第一次构建')}>
        <div>
          <p>要开始构建，请务必完成以下操作：</p>
          <List>
            <Item>
              <p>添加 webhook 地址到 git 仓库，确保 flow.ci 可以正常接收仓库 push 请求事件。
              </p>
            </Item>
            <Item>
              <p>添加 Deploy key 到 git 仓库，确保 flow.ci 可以正常拉取代码开始项目构建。
              </p>
            </Item>
          </List>
          <p>完成上面的操作后，你可以立即发起一次 commit 来触发构建。</p>
        </div>
      </Step>
      <Step title={i18n('点击这里切换 flow')} />
    </Steps>
  }

  render () {
    const { i18n } = this.props
    return <div className={classes.guide}>
      <h3 className={classes.header}>{i18n('如何快速开始一次构建？')}</h3>
      {this.renderSteps()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildGuide)
