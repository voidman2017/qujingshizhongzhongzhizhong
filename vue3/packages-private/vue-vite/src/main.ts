import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import store from './vuex-store'
// import './document-proxy'
const app = createApp(App)

app.use(router)
app.use(store)

const pinia = createPinia()
app.use(pinia)

const _app = app.component('HelloWorld', {
  props: ['msg'],
  template: `<div>{{ msg }}</div>`,
})

// console.log('===debug=== _app === app: ', _app === app) // app.component 会返回 app 本身, 所以可以进行链式调用

app.mount('#app')
