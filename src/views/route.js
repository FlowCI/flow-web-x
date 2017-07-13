import CoreLayout from 'layouts/PageLayout'
import Home from './Home'

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : { component: Home },
})

export default createRoutes
