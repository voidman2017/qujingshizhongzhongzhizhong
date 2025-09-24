<template>
  <div>
    <button @click="changeShallowReactiveProperty">
      changeShallowReactiveProperty
    </button>
    <ul style="color: red">
      <li v-for="item in shallowReactiveObj">{{ item.obj.depth }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { shallowReactive } from 'vue'
const n = 10
const obj = Array(n)
  .fill()
  .map((_, i) => ({
    id: i,
    depth: `${i}-1`, // ← 这是第1层嵌套对象
    obj: {
      depth: `${i}-2`, // ← 这是第2层嵌套对象
      obj: {
        depth: `${i}-3`, // ← 这是第3层嵌套对象
        obj: {
          depth: `${i}-4`, // ← 这是第4层嵌套对象
        },
      },
    },
  }))
console.log('obj', obj)
const shallowReactiveObj = shallowReactive(obj)
/* 
这里shallowReactive方法只会对第一层属性创建响应式，不会递归处理嵌套对象

当模板为 {{ item.obj.depth }} 时，shallowReactive只会创建浅层响应式：
- shallowReactive只会对数组本身创建代理，不会递归处理数组元素
- 数组元素（对象）不会被转换为响应式，它们保持原始状态
- 当访问 item.obj.depth 时，由于 item 不是响应式的，所以嵌套属性的变化不会触发更新

shallowReactive与reactive的主要区别：
- shallowReactive只对第一层属性进行响应式处理
- 嵌套对象不会被转换为响应式，保持原始状态
- 性能更好，因为避免了深度遍历和代理创建
- 适用于只需要监听第一层属性变化的场景

注意：由于使用了shallowReactive，修改嵌套属性（如item.obj.depth）不会触发视图更新
*/

const changeShallowReactiveProperty = () => {
  // shallowReactiveObj[0].obj.depth += '!' // 这样不会触发更新
  const item = shallowReactiveObj[0]
  shallowReactiveObj[0] = {
    ...item,
    obj: {
      ...item.obj,
      depth: item.obj.depth + '!',
    },
  }
}
</script>
