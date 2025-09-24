<template>
  <p>refCount: {{ refCount }}</p>
  <el-button @click="changeRefCount">changeRefCount</el-button>
  <p>reactiveCount: {{ reactiveCount }}</p>
  <el-button @click="changeReactiveCount">changeReactiveCount</el-button>
  <p>reactiveNum: {{ reactiveNum }}</p>
  <el-button @click="changeReactiveNum">changeReactiveNum</el-button>

  <!-- 直接对 ref 对象解构，响应式依然有效 -->
  <p>refObj: {{ refObj }}</p>
  <p>refObj.age: {{ refObj.age }}</p>
  <p>refObj.location: {{ refObj.location }}</p>
  <p>deconstructionRef: {{ deconstructionRef }}</p>
  <el-button @click="addRefObjLocation">addRefObjLocation</el-button>
  <el-button @click="changeDeconstructionRefAge"
    >changeDeconstructionRefAge</el-button
  >
  <el-button @click="changeRefObj">changeRefObj</el-button>

  <!-- 直接对 reactive 对象解构，会失去响应性 -->
  <p>reactiveObj: {{ reactiveObj }}</p>
  <p>deconstructionReactiveName: {{ deconstructionReactiveName }}</p>
  <p>deconstructionReactiveAge: {{ deconstructionReactiveAge }}</p>
  <el-button @click="changeDeconstructionReactiveAge"
    >changeDeconstructionReactiveAge</el-button
  >

  <!-- 通过 toRef 创建的响应式对象，响应式依然有效 -->
  <p>toRefAge: {{ toRefAge }}</p>
  <el-button @click="changeToRefAge">changeToRefAge</el-button>

  <!-- 通过 toRefs 创建的响应式对象，响应式依然有效 -->
  <p>toRefsName: {{ toRefsName }}</p>
  <p>toRefsAge: {{ toRefsAge }}</p>
  <el-button @click="changeToRefsAge">changeToRefsAge</el-button>

  <el-button @click="changeReactiveObj">changeReactiveObj</el-button>

  <!-- 在模板中解包的注意事项 https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#caveat-when-unwrapping-in-templates -->
  <!-- num 是通过 ref 创建的一个 RefImpl 实例对象。这里在代码运行时会执行  _toDisplayString($setup.num + 1) ，那么会通过 RefImpl 实例对象的 get 方法返回其 value 值，所以结果会是 0 + 1 = 1-->
  <p>num+1:{{ num + 1 }}</p>
  <!-- object.id 是 RefImpl 实例对象，这里在代码运行时会执行  _toDisplayString($setup.object.id + 1) 。由于 object.id 对应的是对象，执行 $setup.object.id + 1 的结果是'[object Object]1'， _toDisplayString 接收参数为string则最终直接渲染了 '[object Object]1' -->
  <p>object.id + 1:{{ object.id + 1 }}</p>
  <!-- object2 是通过 reactive 创建的响应式对象，对应的是 Proxy 对象，这里在代码运行时会执行  _toDisplayString($setup.object2.id + 1) 。 $setup.object2.id 为属性读取操作，对应触发 Proxy 的 get 方法，返回其 value 值，所以结果会是 1 + 1 = 2-->
  <p>object2.id + 1: {{ object2.id + 1 }}</p>
  <!-- 这里 num 和 object.id 都是 RefImpl 实例对象，在模板中使用时，会经过 _toDisplayString 中 isRef 判断其为 ref 类型，然后执行 _toDisplayString(val.value) 方法，最终返回其 value 值，所以结果会是 0 和 1 -->
  <p>num: {{ num }}</p>
  <p>object.id:{{ object.id }}</p>
</template>

<script setup>
import { ref, reactive, toRefs, toRef } from 'vue'
/* 1.目标数据类型 */
/* 
通过ref创建的响应式对象，需要通过.value来访问，在模板中使用时，会经过 shallowUnwrapHandlers.get 自动解包处理
通过reactive创建的响应式对象，直接访问属性，无需 .value
reactive 的响应式原理是 Proxy
*/
const refCount = ref(0)
const reactiveCount = reactive({ count: 0 })
/* 使用 reactive 函数处理基础数据类型，在 createReactiveObject 中会判断是否是一个对象，非对象直接返回原始值，同时告警 value cannot be made reactive: 0 */
const reactiveNum = reactive(0)

function changeRefCount() {
  refCount.value++
}
function changeReactiveCount() {
  reactiveCount.count++
}
function changeReactiveNum() {
  reactiveNum++
}

/* 2.解构/传递 */
const refObj = ref({ name: 'mike', age: 18 }) // ref 接收的是一个对象时，toReactive 中判断是对象则调用 reactive 方法，返回的 value 是个 Proxy 对象,所以对其进行
const reactiveObj = reactive({ name: 'john', age: 18 })

function addRefObjLocation() {
  refObj.value.location = 'beijing'
}

/* 解构 */
const { value: deconstructionRef } = refObj // 解构仍有效
const { name: deconstructionReactiveName, age: deconstructionReactiveAge } =
  reactiveObj // ❌ 解构后失去响应性

const toRefAge = toRef(reactiveObj, 'age') // ✅ 通过 toRef 保持响应性

const { name: toRefsName, age: toRefsAge } = toRefs(reactiveObj) // ✅ 通过 toRefs 保持响应性

function changeDeconstructionRefAge() {
  deconstructionRef.age++
}

function changeDeconstructionReactiveAge() {
  deconstructionReactiveAge.age++
}

function changeToRefAge() {
  toRefAge.value++
}

function changeToRefsAge() {
  toRefsAge.value++
}

/* 传递 */

/* 3.重新赋值/对象替换 */
function changeRefObj() {
  refObj.value = { name: 'john', age: 30 } // 整个对象替换有效。但是通过先前通过结构的响应式对象，将与之失去关联
}

function changeReactiveObj() {
  Object.assign(reactiveObj, { name: 'james', age: 30 }) // 需要通过 Object.assign 来修改整个对象，原先通过 toRef、toRefs 创建的响应式对象并未被修改指向，因此关联性依旧存在
  // reactiveObj = { name: 'john', age: 30 } // 整个对象替换无效。因为 reactiveObj 是 Proxy 对象，不能直接赋值
}

const num = ref(0)

const object = { id: ref(1) }

const object2 = reactive({ id: 1 })
</script>
