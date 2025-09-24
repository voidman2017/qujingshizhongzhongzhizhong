import nested from './nested'

const state = () => ({
  count: 0,
  user: { name: '---', id: 0, age: 0 },
})

// getters
const getters = {
  double: state => state.count * 2,
}

// actions
const actions = {
  increment({ commit }) {
    commit('INCREMENT_COUNT')
  },

  // 从 Pinia Composition Mode 迁移
  async fetchUser({ commit }) {
    // 模拟异步请求
    const fetchedUser = await Promise.resolve({ name: 'mike', id: 1, age: 18 })
    commit('SET_USER', fetchedUser)
  },
}

// mutations
const mutations = {
  INCREMENT_COUNT(state) {
    state.count++
  },
  SET_USER(state, user) {
    state.user = user
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    nested,
  },
}
