import nested from './nested'

const state = () => ({
  theme: 'dark',
})

// getters
const getters = {
  getThemeClass(state) {
    return `${state.theme}-theme`
  },
}

// actions
const actions = {
  async fetchTheme({ commit, state }, products) {
    const themes = ['dark', 'light', 'gray', 'italics']
    const themeType = await Promise.resolve(
      themes[Math.floor(Math.random() * themes.length)],
    )
    commit('changeTheme', { type: themeType })
  },
}

// mutations
const mutations = {
  changeTheme(state, { type }) {
    state.theme = type
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
