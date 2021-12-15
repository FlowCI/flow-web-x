import { timeFormat } from "./time"

export const TagNotification = 'notification'

export class PluginWrapper {

  constructor(plugin) {
    this.plugin = plugin
  }

  get id() {
    return this.plugin.id
  }

  get name() {
    return this.plugin.name
  }

  get tags() {
    return this.plugin.tags
  }

  get docker() {
    return this.plugin.meta.docker
  }

  get icon() {
    return this.plugin.meta.icon
  }

  get version() {
    return this.plugin.version
  }

  get desc() {
    return this.plugin.description
  }

  get source() {
    return this.plugin.source
  }

  get isDefaultIcon() {
    return !this.plugin.meta.icon
  }

  get isHttpLinkIcon() {
    const pathOrLink = this.plugin.meta.icon
    if (!pathOrLink) {
      return false
    }

    return pathOrLink.startsWith('http') || pathOrLink.startsWith('https')
  }

  get isRepoSrcIcon() {
    const pathOrLink = this.plugin.meta.icon
    if (!pathOrLink) {
      return false
    }

    return !this.isHttpLinkIcon
  }

  get syncTime() {
    if (this.plugin.syncTime) {
      return timeFormat(this.plugin.syncTime)
    }
    return 'n/a'
  }

  get synced() {
    return this.plugin.synced
  }
}
