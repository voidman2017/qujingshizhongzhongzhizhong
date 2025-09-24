// stores/modules/user.store.ts
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useUserStoreOptionMode = defineStore('userOptionMode', {
  state: () => ({ count: 0 }),
  getters: { double: state => state.count * 2 },
  actions: {
    increment() {
      this.count++
    },
  },
})

export const useUserStoreCompositionMode = defineStore(
  'userCompositionMode',
  () => {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    const user = ref({ name: '---', id: 0, age: 0 })
    function increment() {
      count.value++
    }
    function fetchUser() {
      return Promise.resolve({ name: 'mike', id: 1, age: 18 }).then(res => {
        user.value = res
      })
    }
    return { count, double, increment, fetchUser, user }
  },
)
