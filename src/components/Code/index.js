import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './code.scss'

export default class Code extends PureComponent {
  static propTypes = {
    code: PropTypes.string.isRequired,
    className: PropTypes.string,
    // lineNumbers: PropTypes.bool,
  }

  static defaultProps = {
    code: '',
    className: '',
    lineNumbers: false,
  }

  state = {
    codes: this.props.code.split('\n')
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.code !== nextProps.code) {
      this.setState({ codes: nextProps.code.split('\n') })
    }
  }

  render () {
    const { className } = this.props
    const { codes } = this.state
    return <table className={`code ${classes.table} ${className}`}>
      <tbody>
        {codes.map((code, i) => <tr key={i}>
          <td className={classes.number}>{i + 1}</td>
          <td>{code}</td>
        </tr>)}
      </tbody>
    </table>
  }
}
