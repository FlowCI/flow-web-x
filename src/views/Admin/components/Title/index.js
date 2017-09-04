import React from 'react'
import { string } from 'prop-types'

import classes from './title.scss'

export default function AdminComponentTitle ({ title, subTitle }) {
  return <h4 className={classes.navs}>
    {title}
    {subTitle && <small className={classes.small}>{subTitle}</small>}
  </h4>
}

AdminComponentTitle.propTypes = {
  title: string.isRequired,
  subTitle: string,
}
