import makeCancelable, {
  isPromise,
  cancel,
  copyCancel
} from './promiseCancelable'

export STATUS from './status'

export handleHttpActions from './handleHttpActions'

export HttpProvider from './network'

export isCancel from './isCancel'

export {
  makeCancelable,
  isPromise,
  cancel,
  copyCancel,
}

export default from './middleware'
