import { createLogger, createStore } from 'vuex'
import user from './modules/user'
import common from './modules/common'
import localStoragePlugin from './plugins/localStorage'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    user,
    common,
  },
  strict: debug,
  plugins: debug ? [createLogger(), localStoragePlugin] : [localStoragePlugin],
})
