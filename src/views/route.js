import CoreLayout from 'layouts/PageLayout'
import Home from './Home'
import Next from './Next'
import SignInRoute from './SignIn/route'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : { component: Home },
  childRoutes: [{
    path: '/signin',
    ...SignInRoute(store),
  }, {
    path: '/next',
    component: Next
  }]
})

export default createRoutes
