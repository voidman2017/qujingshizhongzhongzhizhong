import { effect, reactive } from 'vue'

/* 
reactive 方法内部会执行 createReactiveObject 方法，创建一个响应式对象。最终返回一个 Proxy 的实例对象。
详见：packages/reactivity/src/reactive.ts - createReactiveObject (cmd + t)
*/
const obj = {
  count: 0,
  name: 'obj',
}
const proxyObj = reactive(obj)
console.log('===debug=== proxyObj: ', proxyObj)

function createReactiveObjectTypeCheck() {
  /* createReactiveObject 方法中前置的类型校验 */
  const _obj1 = { name: '_obj1' }
  const obj1 = reactive(_obj1)
  const obj2 = reactive(obj1) // 2. 避免重复代理：如果目标已经是代理对象，直接返回
  console.log('===debug=== obj1===obj2: ', obj1 === obj2)

  const obj3 = reactive(obj1) // 3. 缓存检查：如果已经存在对应的代理，直接返回缓存的代理
  console.log('===debug=== obj1===obj3: ', obj1 === obj3)

  /* 4.目标类型验证：只有特定类型的值可以被观察 */
  // 声明__v_skip属性，值为true，代表不进行响应式处理
  const _obj4 = reactive({
    __v_skip: true,
    name: '_obj4',
  })
  // 使用 Object.preventExtensions()
  const _obj5 = { count: 0, name: '_obj5' }
  Object.preventExtensions(_obj5)
  const obj5 = reactive(_obj5)
  // 使用 Object.freeze()
  const _obj6 = { count: 0, name: '_obj6' }
  const frozenObj6 = Object.freeze(_obj6)
  const obj6 = reactive(frozenObj6) // 返回原对象

  console.log('===debug=== obj6===frozenObj6: ', obj6 === frozenObj6) //true
  // 使用 Object.seal()
  const _obj7 = { count: 0, name: '_obj7' }
  const sealedObj7 = Object.seal(_obj7)
  const obj7 = reactive(sealedObj7) // 返回原对象
  console.log('===debug=== obj7===sealedObj7: ', obj7 === sealedObj7) //true
}
// createReactiveObjectTypeCheck()

function handlerChoose() {
  /* proxy 的 Handler 选择 */
  // 使用 baseHandlers
  const obj = reactive({ name: 'Vue' }) // Object -> baseHandlers
  const arr = reactive([1, 2, 3]) // Array -> baseHandlers

  // 使用 collectionHandlers
  const map = reactive(new Map()) // Map -> collectionHandlers
  map.set('count211', 1111)

  const set = reactive(new Set()) // Set -> collectionHandlers
  set.add(1111)

  const weakMap = reactive(new WeakMap()) // WeakMap -> collectionHandlers
  weakMap.set(obj, 1111)

  const weakSet = reactive(new WeakSet()) // WeakSet -> collectionHandlers
  weakSet.add(obj)
}
// handlerChoose()

/*analysis [依赖追踪]: */
const runner = effect(() => {
  document.body.innerHTML = proxyObj.count
})

setTimeout(() => {
  proxyObj.count++
}, 3000)

/* 
### 执行流程分析
初始化阶段：
1. reactive(obj) 创建 Proxy 代理对象
2. effect(fn) 创建 ReactiveEffect 实例并立即执行
3. 执行过程中访问 obj.count ，触发 GET 拦截器
4. 调用 track() 建立依赖关系

更新阶段：
1. obj.count++ 触发 SET 拦截器
2. 调用 trigger() 通知所有依赖的 effect
3. effect 重新执行，更新 DOM

### 关键优化特性
双向链表设计：
- Effect 维护依赖的 Dep 链表
- Dep 维护订阅的 Effect 链表
- 支持高效的添加、删除操作

批量更新：
- 使用 startBatch() 和 endBatch() 批量处理更新
- 避免同步执行时的重复更新

版本控制：
- 每个 Dep 都有版本号
- 通过版本比较避免不必要的重新计算

内存优化：
- 使用 WeakMap 存储依赖关系，支持垃圾回收
- 自动清理无效的依赖链接
### 总结
Vue 3 的响应式系统通过 Proxy + 双向链表的设计，实现了高效的依赖追踪和更新机制。相比 Vue 2 的 Object.defineProperty，具有更好的性能和更完整的拦截能力，支持数组索引、Map/Set 等复杂数据结构的响应式处理。
https://www.cnblogs.com/heavenYJJ/p/18542806
https://juejin.cn/post/7345725753018236947
https://www.cnblogs.com/heavenYJJ/p/18397413
*/
