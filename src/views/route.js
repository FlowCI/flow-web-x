import CoreLayout from 'layouts/PageLayout'
import Home from './Home'
import Next from './Next'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : { component: Home },
  childRoutes: [{
    path: '/next',
    component: Next
  }]
})

export default createRoutes
