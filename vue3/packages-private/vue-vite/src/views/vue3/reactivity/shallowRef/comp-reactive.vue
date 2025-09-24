<template>
  <div>
    <button @click="changeReactiveProperty">changeReactiveProperty</button>
    <ul style="color: red">
      <li v-for="item in reactiveObj">{{ item.obj.depth }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
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
const reactiveObj = reactive(obj)
/* 
这里reactive方法共计执行 1 + depth * n 次。这里涉及到reactive会递归创建响应式

当模板为 {{ item.obj.depth }} 时，reactive会递归创建响应式，执行次数为 1 + 2n = 1 + 20 = 21 次（n=10）：
- 第一次创建代理的次数：1 + 2n = 1 + 20 = 21 次（n=10）
- 为什么是 1 + 2n：
    - 1 次：执行 reactive(obj) 时，整个数组 obj 被包成一个 Proxy。
    - n 次：v-for 遍历时读取每个元素 item（数组的 get），如果元素是对象，会懒转换成响应式（对每个元素对象执行一次 reactive）。
    - n 次：在每个 li 内部还会读取 item.obj（对象的 get），如果该属性值是对象，同样会懒转换（对每个 item 的第二层 obj 再各执行一次 reactive）。
- 模板只访问到 item.obj.depth，因此更深层的 obj.obj 并没有被访问，不会触发进一步的懒转换。

当模板为 {{ item.obj.obj.depth }} 时，reactive会递归创建响应式，执行次数为 1 + 3n = 1 + 30 = 31 次（n=10）：
为什么是 1 + 3n：
    - 1 次：执行 reactive(obj) 时，整个数组被包成一个 Proxy。
    - n 次：v-for 读取每个元素 item（数组 get），元素是对象，第一次读时会被懒转换为响应式（对每个元素对象执行一次 reactive）。
    - n 次：模板读 item.obj（对象 get），该属性值是对象，再被懒转换一次。
    - n 次：模板进一步读 item.obj.obj.depth，第三层的 depth 被访问到，不会触发进一步的懒转换。
模板最终只读到第三层的 depth，因此第4层不会被访问到，也就不会再触发懒包裹。
*/

const changeReactiveProperty = () => {
  reactiveObj[0].obj.depth += '!'
}
</script>
