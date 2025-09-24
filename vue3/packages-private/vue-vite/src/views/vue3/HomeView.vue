<template>
    <div class="home-container">
      <h1>{{ title }}</h1>
    </div>
</template>
  


<script setup lang="ts">
// 导入需要的组件和函数
import { ref, onMounted } from 'vue'

// 响应式数据
const title = ref('hello vue3')

// 生命周期钩子
onMounted(() => {
  console.log('首页组件已挂载')
})
</script>


<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

p {
  color: #666;
}
</style>
