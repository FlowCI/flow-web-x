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
  keys.forEach((key) => {
    if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

    mustReplace = true
    store.asyncReducers[key] = reducers[key]
  })

  mustReplace && store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
