import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { Steps, Step } from './Steps'
import { List, Item } from './List'

import classes from './guide.scss'

export default class BuildGuide extends Component {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  renderFooter () {
    return <div className={classes.footer}>
      <hr />
      <p>如果上面几步你已完成，触发构建时本页面会自动刷新，</p>
      <p>你可以静静的等待或者 <a>阅读我们的文档</a></p>
      <p>工作愉快</p>
    </div>
  }

  renderSteps () {
    const { i18n } = this.props
    return <Steps>
      <Step title={i18n('在你的项目中添加 .flow.yml 配置文件')}
        thumbnail={require('static/images/flow_yml.png')}>
        <List>
          <Item>
            <p>填写 flow 名称</p>
          </Item>
          <Item>
            <p>
               配置 git 仓库
            </p>
          </Item>
          <Item>
            <div>
              <p>配置 yml 工作流，flowci 会根据你配置的工作流执行构建任务，之后可在“工作流设置”中修改 yml 工作流。</p>
              <a>点击查看 yml 文件编写规范</a>
            </div>
          </Item>
        </List>
      </Step>
      <Step title={i18n('通过 git push 触发第一次构建')}
        thumbnail={require('static/images/git.png')}>
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
      <Step title={i18n('点击这里切换 flow')}
        thumbnail={require('static/images/flow.png')} />
    </Steps>
  }

  render () {
    const { i18n } = this.props
    return <div className={classes.guide}>
      <h3 className={classes.header}>{i18n('如何快速开始一次构建？')}</h3>
      {this.renderSteps()}
      {this.renderFooter()}
    </div>
  }
}
