import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: window.sessionStorage.getItem('user' || '[]') == null ? null : JSON.parse(window.sessionStorage.getItem('user' || '[]')),
    buildings: [
    ]
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.sessionStorage.setItem('user', JSON.stringify(user))
    },
    saveBuildings (state, buildings) {
      state.buildings = buildings
    },
    logOut (state) {
      window.sessionStorage.clear()
      state.user = null
    }
  }
})
