import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './steps.scss'

export default class GuideStep extends PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    thumbnail: PropTypes.string,
  }

  static defaultProps = {
    index: 0
  }

  render () {
    const { index, title, children, thumbnail } = this.props
    return <li className={classes.step}>
      <span className={classes.number}>{index}</span>
      <h4 className={classes.title}>
        {title}
      </h4>
      <img src={thumbnail} className={classes.thumbnail} />
      {children}
    </li>
  }
}
