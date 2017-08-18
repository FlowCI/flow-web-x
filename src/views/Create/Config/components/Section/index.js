import React from 'react'
import { node, string } from 'prop-types'

import IconButton from 'components/IconButton'

import classes from './section.scss'

export function Section ({ children }) {
  return <section className={classes.section}>
    {children}
  </section>
}

Section.propTypes = {
  children: node.isRequired
}

export function SectionTitle ({ title, subTitle, question, action }) {
  return <h5 className={classes.title}>
    {title}
    {!!question && <IconButton className={classes.question}>
      <i className='icon icon-question-thin' />
    </IconButton>}
    {action}
    {!!subTitle && <small className={classes.subTitle}>
      {subTitle}
    </small>}
  </h5>
}

SectionTitle.propTypes = {
  title: string.isRequired,
  subTitle: string,
  question: string, // question text,
  action: node,
}
