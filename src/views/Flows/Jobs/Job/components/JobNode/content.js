import React from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import Loading from 'components/Loading'

import classes from './node.scss'
export default function JobNodeContent ({ fetching, log, emptyText, onClose }) {
  const show = !!log || !fetching
  return <code className={classes.code}>
    {!show && <Loading size={20} />}
    {show && (log || emptyText)}
    {show && !!log && <Button className={`btn-primary hide ${classes.close}`}
      size='sm' useSpinner={false} onClick={onClose}
    >
      Close
    </Button>}
  </code>
}
JobNodeContent.propTypes = {
  log: PropTypes.string,
  emptyText: PropTypes.string,
  fetching: PropTypes.bool,
  onClose: PropTypes.func
}
JobNodeContent.defaultProps = {
  emptyText: '无日志'
}
