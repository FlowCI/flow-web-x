export class ArtifactNode {
  constructor (artifact, dir = false) {
    this.raw = artifact
    this.childrenItems = []
    this.dir = dir
  }

  get id () {
    return this.raw.id
  }

  get name () {
    return this.raw.fileName
  }

  get extension () {
    return this.name.split('.').pop()
  }

  get children () {
    return this.childrenItems
  }

  get isDir () {
    return this.dir
  }

  get contentSize () {
    return this.raw.contentSize
  }

  set children (items) {
    this.childrenItems = items
  }
}