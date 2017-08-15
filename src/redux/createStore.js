import {
  applyMiddleware,
  compose,
  createStore as createReduxStore
} from 'redux'
import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import { routerMiddleware } from 'react-router-redux'
import httpMiddleware from 'redux-http'
import httpMockMiddleware from 'redux-http/src/mock'
import { resquestHeaders, log } from './middlewares'
const createStore = (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk,
    routerMiddleware(history),
    log,
    resquestHeaders,
    httpMockMiddleware(),
    httpMiddleware({
      baseURL: __API__
    }),
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  let composeEnhancers = compose

  if (__DEV__) {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createReduxStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  // store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}

export default createStore
