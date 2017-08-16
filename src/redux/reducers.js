import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import rootReducer from './modules'
import { reducer as formReducer } from 'redux-form'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router: routerReducer,
    form: formReducer,
    ...rootReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, reducers) => {
  const keys = Object.keys(reducers)

  let mustReplace = false
  const { asyncReducers } = store
  keys.forEach((key) => {
    if (Object.hasOwnProperty.call(asyncReducers, key)) {
      if (!__DEV__ || asyncReducers[key] === reducers[key]) {
        return
      }
    }
    mustReplace = true
    asyncReducers[key] = reducers[key]
  })

  mustReplace && store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
