import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './steps.scss'

export default class GuideSteps extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    begin: PropTypes.number.isRequired,
  }

  static defaultProps = {
    begin: 1,
  }

  cloneChild = (child, index) => {
    return React.cloneElement(child, {
      index: this.props.begin + index
    })
  }

  render () {
    const { children } = this.props
    return <ul className={classes.steps}>
      {React.Children.map(children, this.cloneChild)}
    </ul>
  }
}
