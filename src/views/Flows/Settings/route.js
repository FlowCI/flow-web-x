export default function (store) {
  return {
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
    }, {
      path: 'envs'
    }]
  }
}
