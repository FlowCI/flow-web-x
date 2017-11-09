import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'

import Input from 'components/Form/Input'
import Button from 'components/Button'

import Well from './components/Well'

import classes from './create.scss'

function mapStateToProps (state, props) {
  return {
    location: state.router.locationBeforeTransitions,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
    redirect: push,
  }, dispatch)
}

export class CreateFlowView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  state = {
    name: '',
    git: 'custom',
  }

  handleNameChange = (value) => {
    this.setState({ name: value })
  }

  selectGit = (git) => {
    this.setState({ git })
  }

  handleNext = async () => {
    const { name, git } = this.state
    const { location, create, redirect } = this.props
    const { data: flow } = await create(name)
    const next = git === 'custom' ? '' : git
    redirect({
      ...location,
      pathname: `${location.pathname}/${flow.id}/${next}`
    })
  }

  renderWell (value, icon, title, subTitle) {
    const { git } = this.state
    return <Well value={value} active={git === value}
      icon={icon} title={title} subTitle={subTitle}
      onActive={this.selectGit}
    />
  }

  render () {
    const { i18n } = this.props
    const { name, git } = this.state

    const enabled = name && git
    return <div>
      <div className={classes.wrapper}>
        <h5 className={classes.title}>
          {i18n('为你的 flow 起个名字')}
          <small>{i18n('（如果使用了 yml 配置文件，需与 yml 配置文件中的 flow 字段保持匹配）')}</small>
        </h5>
        <Input type='text' value={name} className={classes.input}
          placeholder={i18n('例：ios-test')}
          onChange={this.handleNameChange} />
      </div>
      <hr />
      <div className={classes.wrapper}>
        <ul className={classes.gits}>
          <li>
            {this.renderWell('custom', <i className='icon icon-equalizer' />,
              i18n('手动配置 Git 仓库'),
              i18n('适合所有 Git 仓库，需手动配置 WebHook 地址 或 Deploy key')
            )}
          </li>
        </ul>
        <Button disabled={!enabled} onClick={this.handleNext}
          className={`btn btn-primary ${classes.next}`}>
          下一步
        </Button>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFlowView)
