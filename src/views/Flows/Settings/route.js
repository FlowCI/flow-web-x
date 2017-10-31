import Container from './index'
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
      navbar: true,
      text: 'Build',
    }, {
      path: 'envs',
      navbar: true,
      text: 'Envs',
    }]
  }
}
