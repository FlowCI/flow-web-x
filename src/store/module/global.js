import http from '../http'

export const Store = {
  namespaced: true,
  state: {
    snackbar: {
      show: false,
      text: '',
      color: ''
    },

    showCreateFlow: false,
    staticBaseUrl: `${http.host}/static`
  },
  mutations: {
    show (state, {text, color}) {
      state.snackbar.text = text;
      state.snackbar.show = true;
      state.snackbar.color = color;
    },

    popCreateFlow(state, val) {
      state.showCreateFlow = val
    }
  }
}
