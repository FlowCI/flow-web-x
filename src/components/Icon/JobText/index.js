import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createResource from 'i18n'
import language from 'util/language'

import JobIcon from '../Job'

import classes from './style.scss'

function getResoure () {
  const l = language // 不知为何一定要赋予此变量
  const resource = require(`locales/${l}/job`).default
  return resource && resource.STATUS ? resource.STATUS : {}
}

const defaultI18n = createResource(getResoure())

export {
  classes,
  defaultI18n as i18n,
}

export default class JobIconText extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    i18n: PropTypes.func.isRequired,
    classNames: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    i18n: defaultI18n,
    classNames: classes,
  }

  render () {
    const { status, i18n, className, classNames } = this.props
    const cls = [classNames.wrapper]
    className && cls.push(className)

    return <span className={cls.join(' ')}>
      <JobIcon {...this.props} className={classNames.icon}
        classNames={undefined} />
      {i18n(status)}
    </span>
  }
}
