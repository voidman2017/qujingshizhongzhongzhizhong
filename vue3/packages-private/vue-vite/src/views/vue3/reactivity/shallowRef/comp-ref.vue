<template>
  <div>
    <button @click="changeRefProperty">changeRefProperty</button>
    <ul style="color: red">
      <li v-for="item in refObj">{{ item.obj.depth }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
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
const refObj = ref(obj)
/* 
这里ref方法会将整个对象包装在一个ref中，但内部对象仍然是深度响应式的

当模板为 {{ item.obj.depth }} 时，ref会创建一个包装器，但内部对象仍然会被递归转换为响应式：
- ref会创建一个包装器来包装整个数组
- 当访问 .value 时，内部的对象会被转换为响应式（类似reactive的行为）
- v-for 遍历时读取每个元素 item，如果元素是对象，会懒转换成响应式
- 在每个 li 内部还会读取 item.obj，如果该属性值是对象，同样会懒转换

ref与reactive的主要区别：
- ref需要通过.value访问值（在模板中会自动解包）
- ref可以重新赋值整个对象，而reactive不能
- ref内部对于对象类型会调用reactive来实现深度响应式
*/

const changeRefProperty = () => {
  refObj.value[0].obj.depth += '!'
}
</script>
