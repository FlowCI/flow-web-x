import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
  ListCol,
} from '../components/List'

import classes from './system.scss'

export default class JvmSystemInfo extends Component {
  static propTypes = {
    jvm: ImmutablePropTypes.map.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  renderList () {
    const { jvm } = this.props
    const info = jvm.get('info')
    const array = info.reduce((array, map, key) => {
      return array.concat(map.reduce((arr, v, k) => {
        arr.push({ name: k, value: v })
        return arr
      }, []))
    }, [])
    return <List>
      <ListHead>
        <ListRow>
          <ListHeadCol>名称</ListHeadCol>
          <ListHeadCol>值</ListHeadCol>
        </ListRow>
      </ListHead>
      <ListBody>
        {array.map((item) => {
          const { name, value } = item
          return <ListRow key={name}>
            <ListCol>{name}</ListCol>
            <ListCol>{value}</ListCol>
          </ListRow>
        })}
      </ListBody>
    </List>
  }

  render () {
    const { i18n } = this.props
    return <div className={classes.section}>
      <h5 className={classes.title}>
        {i18n('系统信息')}
      </h5>
      {this.renderList()}
    </div>
  }
}
