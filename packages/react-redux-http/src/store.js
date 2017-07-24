import { cancel } from 'redux-http'

export default function createStore () {
  return {
    unmount: {
      data: [],
      push (name, promise) {
        this.data.push(promise)
      },
      remove (name, promise) {
        const array = this.data
        const index = array.indexOf(promise)
        index > -1 && array.splice(index, 1)
      },
      destroy () {
        this.data.forEach(cancel)
      }
    },
    unique: {
      data: {},
      push (name, promise) {
        this.data[name] = promise
      },
      remove  (name, promise) {
        const p = this.data[name]
        if (p === promise) {
          this.data[name] = undefined
        }
      },
      destroy () {
        Object.keys(this.data).forEach((k) => {
          cancel(this.data[k])
        })
      }
    }
  }
}
