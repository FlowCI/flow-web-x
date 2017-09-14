import React from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import Loading from 'components/Loading'

import classes from './node.scss'
export default function JobNodeContent ({ fetching, log, emptyText, onClose }) {
  return <code className={classes.code}>
    {fetching && <Loading size={20} />}
    {!fetching && (log || emptyText)}
    {!fetching && !!log && <Button className={`btn-primary ${classes.close}`}
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
