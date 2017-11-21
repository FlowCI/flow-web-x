import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'

import DocumentTitle from 'react-document-title'

import V from 'validates'
import Input from 'react-little-liar/src/Input'
import { FieldSet } from 'components/ReduxForm/createAdapter'
import Button from 'components/Buttonx'

import Well from './components/Well'

import classnames from 'classnames'
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
    const error = V.flowName(value)
    this.setState({ name: value, error })
  }

  selectGit = (git) => {
    this.setState({ git })
  }

  handleNext = async () => {
    const { name, git, error } = this.state
    if (error) {
      return
    }
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
    const { name, git, error } = this.state

    const enabled = name && git
    return <DocumentTitle title='创建 flow'>
      <div>
        <div className={classnames(classes.wrapper, classes.form)}>
          <h5 className={classes.title}>
            {i18n('为你的 flow 起个名字')}
          </h5>
          <FieldSet error={error} invalid={!!error}
            adapterClassName={classes.field}>
            <Input type='text' value={name} className={classes.input}
              invalid={!!error}
              placeholder={i18n('例：ios_test')}
              onChange={this.handleNameChange}
              onPressEnter={this.handleNext} />
          </FieldSet>
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
          <Button disabled={!enabled} type='primary'
            onClick={this.handleNext}
            className={classes.next}>
            下一步
          </Button>
        </div>
      </div>
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFlowView)
