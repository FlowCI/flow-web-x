## Cancel
```
import { cancel, isCancel } from 'redux-axios'
const promise = dispatch(someAxiosRequest())
promise.then(() => {
  // do something when success
}, (e) => {
  if (!isCancel(e)) {
    // do something when error and not cancel
  }
})

// in willUnMount () {
  cancel(promise)
}
```