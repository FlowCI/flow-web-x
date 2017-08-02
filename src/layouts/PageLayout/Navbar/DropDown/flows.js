import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

import DropDown from './dropdown'

import classes from './flows.scss'

export default class NavbarFlowsDropdown extends PureComponent {
  static propTypes = {
    // flows: PropTypes.array,
  }

  static defaultProps = {
  }

  render () {
    return <DropDown className={classes.content} arrowClass={classes.arrow}>
      Hello World
    </DropDown>
  }
}
