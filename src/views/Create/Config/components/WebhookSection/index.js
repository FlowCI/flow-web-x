import React from 'react'
import { string, func } from 'prop-types'

import ClipboardButton from 'components/ClipboardButton'

import { Section, SectionTitle } from '../Section'

import classes from './webhook.scss'

export default function WebhookSection ({ webhook, i18n }) {
  return <Section>
    <SectionTitle title={i18n('手动添加 WebHook 地址到你的 Git 仓库')}
      question='link for doc'
    />
    <code className={classes.code}>
      {webhook}
      <ClipboardButton data-clipboard-text={webhook}
        className={classes.copy} />
    </code>
  </Section>
}

WebhookSection.propTypes = {
  webhook: string.isRequired,
  i18n: func.isRequired,
}
