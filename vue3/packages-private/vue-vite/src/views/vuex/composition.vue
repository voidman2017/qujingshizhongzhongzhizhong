<template>
  <div>
    <p>当前主题: {{ themeClass }}</p>
    <button @click="fetchTheme">获取主题</button>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const themeClass = ref(store.getters['common/getThemeClass'])

const fetchTheme = async () => {
  await store.dispatch('common/fetchTheme')
  themeClass.value = store.getters['common/getThemeClass']
}

onMounted(() => {
  themeClass.value = store.getters['common/getThemeClass']
})
</script>    