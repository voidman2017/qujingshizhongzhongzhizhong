<template>
  <div>
    <button @click="changeShallowRefProperty">changeShallowRefProperty</button>
    <ul style="color: blue">
      <li v-for="item in shallowRefObj">{{ item.obj.depth }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, triggerRef } from 'vue'
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

const shallowRefObj = shallowRef(obj)
const changeShallowRefProperty = () => {
  shallowRefObj.value[0].obj.depth += '!'
  triggerRef(shallowRefObj)
}
</script>
