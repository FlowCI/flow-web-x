export const Store = {
  namespaced: true,
  state: {
    error: {}
  },
  mutations: {
    set (state, error) {
      state.error = error
    }
  }
}
