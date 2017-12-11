import React, { Component } from 'react'
import PropTypes from 'prop-types'

import escapeHtml from 'util/escapeHtml'
import ansiHTMLFactory from 'ansiToHtml'

import Loading from 'components/Loading'

import classes from './node.scss'

const ansiHTML = ansiHTMLFactory()

export default class JobNodeContent extends Component {
  static propTypes = {
    log: PropTypes.string,
    emptyText: PropTypes.string,
    fetching: PropTypes.bool,
    // onClose: PropTypes.func
  }

  static defaultProps = {
    emptyText: '无日志'
  }

  componentDidMount () {
    const { log } = this.props
    if (log) {
      this.scrollToBottom()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // 日志内容发生变化则自动滚动至底部
    if (this.props.log !== prevProps.log) {
      this.scrollToBottom()
    }
  }

  scrollToBottom () {
    if (this.el) {
      this.el.scrollTop = this.el.scrollHeight
    }
  }

  render () {
    const { fetching, log, emptyText } = this.props
    const show = !!log || !fetching
    const h = !show ? '' : (log ? ansiHTML(escapeHtml(log)) : emptyText)
    return <code className={classes.code} ref={(el) => { this.el = el }}>
      {!show && <Loading size={20} />}
      {show && <div dangerouslySetInnerHTML={{ __html: h }} />}
    </code>
  }
}
