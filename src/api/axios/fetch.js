import axios from 'axios'

export function fetch (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      headers: {
        Token: 'helloflowciadmin'
      },
      timeout: 30 * 1000
    })
    instance(options).then(res => {
      resolve(res)
    })
      .catch(err => {
        reject(err)
      })
  })
}
