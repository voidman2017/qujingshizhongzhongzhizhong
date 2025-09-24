<template>
  <div class="reactive-container">
    <el-affix :offset="0">
      <el-button type="primary">{{ throttledScroll }}</el-button>
    </el-affix>

    <el-card>
      <template #header>ref</template>
      <el-row>
        <el-col :span="4">
          <!-- 模板渲染中之所以能够自动解包，是因为在模板渲染时会经过 shallowUnwrapHandlers 处理 -->
          <p>count: {{ count }}</p>
        </el-col>
        <el-col :span="4">
          <p>obj: {{ obj }}</p>
        </el-col>
      </el-row>
      <el-button @click="count++">count++</el-button>
      <el-button @click="addCount">addCount</el-button>
      <el-button @click="obj.a++">obj.a++</el-button>
      <el-button @click="addObjA">addObjA</el-button>
      <el-button @click="obj.b = obj.b ? obj.b + 1 : 1">add obj.b</el-button>
      <el-button @click="addObjB">addObjB</el-button>
    </el-card>

    <el-card>
      <template #header>reactive</template>
      <el-row>
        <el-col :span="4">
          <p>count: {{ reactiveObj.count }}</p>
        </el-col>
        <el-col :span="20">
          <p>list: {{ reactiveObj.list }}</p>
        </el-col>
      </el-row>
      <el-button @click="reactiveObjCount">reactiveObj.count++</el-button>
      <el-button @click="reactiveObjListPush">reactiveObj.list.push</el-button>
      <el-button @click="reactiveObjListSetValueByIndex"
        >reactiveObj.listListIndex = 100</el-button
      >
    </el-card>

    <el-card>
      <template #header>toRef/toRefs</template>
      <p>aRef: {{ aRef }}</p>
      <p>aRef2: {{ aRef2 }}</p>
      <p>bRef2: {{ bRef2 }}</p>
      <el-button @click="aRef++">aRef.value++</el-button>
      <el-button @click="aRef2++">aRef2.value++</el-button>
      <el-button @click="bRef2++">bRef2.value++</el-button>
    </el-card>

    <el-card>
      <template #header>readonly</template>
      <p>roState: {{ roState }}</p>
      <el-button @click="roState.a++">roState.a++</el-button>
    </el-card>

    <el-card>
      <template #header>shallowRef</template>
      <p>shallowRefObj: {{ shallowRefObj }}</p>
      <el-button @click="shallowRefChange">shallowRefChange</el-button>
    </el-card>

    <el-card>
      <template #header>shallowReactive</template>
      <p>shallowState: {{ shallowState }}</p>
      <el-button @click="shallowStateChange">shallowStateChange</el-button>
    </el-card>

    <el-card>
      <template #header>customRef - 搜索防抖示例</template>
      <p>搜索内容: {{ searchText }}</p>
      <el-input v-model="searchText" placeholder="请输入搜索内容" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRef,
  toRefs,
  readonly,
  shallowRef,
  shallowReactive,
  customRef,
} from 'vue'

/* 1. ref
用途：用于创建响应式的基本类型数据或对象引用。
特点：通过.value访问和修改值，模板中自动解包。 */

/* 
packages/reactivity/src/ref.ts
ref 通过 createRef 返回一个 RefImpl 实例对象。其中会调用 toReactive 对 _value 进行赋值。
toReactive 会判断是否为对象，如果是对象则调用 reactive 方法，否则直接返回。
定义 value 属性的 get 和 set 方法。
get 方法中会调用 track 方法，收集依赖。
set 方法中会调用 trigger 方法，触发依赖。
*/
const count = ref<number>(0)
console.log('ref-count', count, count.value)
const obj = ref<{ a: number; b?: number }>({ a: 1 }) // 对象（内部会调用reactive）
console.log('ref-obj', obj, obj.value)
function addCount() {
  count.value++
}
function addObjA() {
  obj.value.a++
}
function addObjB() {
  obj.value.b = obj.value.b ? obj.value.b + 1 : 1
}

/* 
2. reactive
用途：创建响应式对象或数组（深层次响应）。
特点：直接操作属性，无需.value，但不可直接替换整个对象。
*/

/* 
packages/reactivity/src/reactive.ts
reactive 通过 createReactiveObject 返回一个 Proxy 实例对象。
其中会调用 createReactiveObject 方法，对 target 进行代理。
createReactiveObject 会判断是否为对象，如果是对象则调用 reactive 方法，否则直接返回。
*/
const reactiveObj = reactive({
  count: 0,
  list: [] as number[],
})
console.log('reactiveObj', reactiveObj)
function reactiveObjCount() {
  reactiveObj.count++
}
function reactiveObjListPush() {
  reactiveObj.list.push(reactiveObj.list.length + 1)
}
function reactiveObjListSetValueByIndex() {
  reactiveObj.list[reactiveObj.list.length - 1] = 100
}

/* 3. toRef 和 toRefs
toRef
将响应式对象的某个属性转换为ref，保持与源属性的响应式连接。
toRefs
将整个响应式对象的所有属性转换为ref集合，适合解构后保持响应式。 */
const state1 = reactive({ a: 1 })
/* toRef 会调用 packages/reactivity/src/ref.ts -> propertyToRef。
最终返回一个 ObjectRefImpl 实例对象 */
const aRef = toRef(state1, 'a') // 通过aRef.value访问
console.log('aRef', aRef, aRef.value, aRef === state1.a)

const state2 = reactive({ a: 1, b: 2 })
const { a: aRef2, b: bRef2 } = toRefs(state2) // a.value, b.value
console.log('aRef2', aRef2, aRef2.value)
console.log('bRef2', bRef2, bRef2.value)

/* 
4. readonly
用途：创建只读的响应式对象（基于ref或reactive）。
特点：任何修改尝试都会触发警告。
*/
const roState = readonly(reactive({ a: 1 })) as { a: number }
console.log('roState', roState)

/* 
5. 浅层响应式 (shallowRef 和 shallowReactive)
shallowRef 仅响应.value的变化，不追踪内部属性改动。
shallowReactive 仅响应对象顶层属性的变化，不递归深层属性。
*/
const shallowRefObj = shallowRef<{ a?: number; b?: number }>({ a: 1 })
function shallowRefChange() {
  shallowRefObj.value.a = 2 // 不会触发更新
  setTimeout(() => {
    shallowRefObj.value = { b: 3 } // 会触发更新
  }, 1000)
}

const shallowState = shallowReactive({ a: 1, nested: { b: 2 } })
function shallowStateChange() {
  setTimeout(() => {
    shallowState.a = 2 // 触发更新
  }, 1000)
  shallowState.nested.b = 3 // 不触发更新
}

/* 
6. 自定义响应式 (customRef)
用途：自定义ref的依赖追踪和触发逻辑（如实现防抖）。
*/
function useDebounceRef(initialValue: string, delay: number) {
  let timer: number | null = null
  let value = initialValue

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue: string) {
      // 立即更新值，使输入框响应及时
      value = newValue
      trigger() // 立即触发更新

      // 清除之前的定时器
      if (timer) {
        clearTimeout(timer)
      }

      // 设置新的定时器来处理搜索逻辑
      timer = setTimeout(() => {
        // 在这里发起搜索请求
        console.log('开始搜索:', newValue)
      }, delay)
    },
  }))
}

// 使用搜索防抖ref
const searchText = useDebounceRef('', 300)

function useThrottleRef(initialValue: number, delay: number) {
  let timer: number | null = null
  let value = initialValue

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue: number) {
      if (!timer) {
        timer = setTimeout(() => {
          value = newValue
          trigger()
          timer = null
        }, delay)
      }
    },
  }))
}

// 使用节流ref
const throttledScroll = useThrottleRef(0, 0)
document.addEventListener('scroll', () => {
  throttledScroll.value = window.scrollY
})

/* 
| 方法                | 适用场景                                      |
|---------------------|---------------------------------------------|
| `ref`               | 基本类型、需替换引用的对象、模板中的响应式变量  |
| `reactive`          | 复杂对象/数组的深层响应式                   |
| `toRefs`            | 解构`reactive`对象并保持响应式              |
| `readonly`          | 不可变数据（如props）                      |
| `shallowRef`        | 大型对象/性能敏感场景（仅跟踪`.value`变化） |
| `shallowReactive`   | 仅需顶层响应式的对象                       |
| `customRef`         | 需要自定义响应逻辑（如防抖、异步操作）     |
*/
</script>

<style scoped>
.reactive-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.throttled-scroll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
