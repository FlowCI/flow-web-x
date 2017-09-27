import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/credential'

import Button from 'components/Button'
import Loading from 'components/Loading'
import { Section, SectionTitle } from '../components/Section'
import DeployItem from './deployItem'

import classes from './deploy.scss'

const credentialType = 'RSA'

function mapStateToProps (state, { flowId }) {
  const { credential } = state
  return {
    deploys: credential.get(credentialType, new List()),
    loaded: credential.getIn(['ui', 'QUERY']) === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    freedAll: actions.freedAll,
  }, dispatch)
}

export class DeployList extends Component {
  static propTypes = {
    deploys: ImmutablePropTypes.list.isRequired,
    loaded: PropTypes.bool,
    selected: PropTypes.string,

    onSelect: PropTypes.func.isRequired,

    query: PropTypes.func.isRequired,
    freedAll: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {}

  componentDidMount () {
    const { query } = this.props
    query(credentialType)
  }

  componentWillUnmount () {
    const { freedAll } = this.props
    freedAll()
  }

  renderList () {
    const { deploys, selected, onSelect } = this.props
    return <ul className={classes.list}>
      {deploys.map((deploy) => {
        const name = deploy.get('name')
        return <DeployItem key={name} checked={name === selected}
          deploy={deploy} onChange={onSelect} />
      })}
    </ul>
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  render () {
    const { i18n, loaded } = this.props
    return <Section>
      <SectionTitle title={i18n('Deploy Key（可选）')}
        question='link for doc'
        action={<Button className='btn-link' size='sm'>新建一个</Button>}
        subTitle={i18n('如没有 Git 仓库访问权限，请添加 Deploy Key 到 Git 仓库的项目或者用户设置')}
      />
      {loaded ? this.renderList() : this.renderLoading()}
    </Section>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(DeployList)
)
