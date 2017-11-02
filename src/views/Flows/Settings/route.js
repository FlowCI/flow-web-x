import Container from './index'
import Build from './Build'
import Envs from './Envs'
import Yml from './Yml'

export default function (store) {
  return {
    component: Container,
    indexRoute: {
      onEnter: (nextState, replace) => {
        const { location } = nextState
        replace({
          ...location,
          pathname: `${location.pathname}/build`
        })
      }
    },
    childRoutes: [{
      path: 'build',
      component: Build,
      navbar: true,
      text: 'Build',
    }, {
      path: 'envs',
      component: Envs,
      navbar: true,
      text: 'Envs',
    }, {
      path: 'yml',
      component: Yml,
      navbar: true,
      text: 'Yml',
    }]
  }
}
