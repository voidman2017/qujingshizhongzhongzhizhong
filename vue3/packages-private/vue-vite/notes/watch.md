## watch vs watchEffect

在 Vue 3 的响应式系统中，`watch` 和 `watchEffect` 本质上都是用于管理副作用的工具，但它们的适用场景有显著差异。以下是场景化决策指南：

---

### 📌 **适合使用 `watch` 的场景**

#### 1. 需要精准控制侦听源

```js
// 明确监听特定 ref/reactive 属性
watch([userId, projectId], ([newUserId, newProjectId]) => {
  fetchData(newUserId, newProjectId)
})
```

#### 2. 需要访问旧值（previous value）

```js
watch(searchQuery, (newVal, oldVal) => {
  analytics.track('SEARCH_QUERY_CHANGE', { from: oldVal, to: newVal })
})
```

#### 3. 惰性执行（默认不立即执行）

```js
// 只在路由参数变化时触发
watch(
  () => route.params.id,
  id => {
    loadDetail(id)
  },
)
```

#### 4. 需要深度监听复杂对象

```js
const filters = reactive({
  status: 'active',
  tags: [],
})

// 深度监听对象变化（需主动声明）
watch(
  filters,
  newFilters => {
    applyFilters(newFilters)
  },
  { deep: true },
)
```

#### 5. 需要手动分离依赖

```js
// 当需要不同依赖触发不同逻辑时
watch([isDarkMode, systemTheme], ([darkMode, systemTheme]) => {
  // 专门处理主题切换逻辑
})
```

---

### 🌟 **适合使用 `watchEffect` 的场景**

#### 1. 依赖关系复杂/动态变化

```js
// 自动追踪任意组合的依赖
watchEffect(async () => {
  const response = await fetch(
    `/api/${route.params.type}?page=${pagination.page}&sort=${sortBy.value}`,
  )
  // 自动追踪 route.params.type / pagination.page / sortBy.value
})
```

#### 2. 需要立即执行的副作用

```js
// 初始化时立即执行一次（类似 mounted 逻辑）
watchEffect(() => {
  if (user.value.isAuthenticated) {
    connectWebSocket() // 页面加载时立即检查用户状态
  }
})
```

#### 3. 涉及多个嵌套属性的操作

```js
const formState = reactive({
  fields: {
    username: '',
    password: '',
  },
  validation: {},
})

// 只追踪实际使用的属性（username 变化时触发）
watchEffect(() => {
  if (formState.fields.username.length < 6) {
    formState.validation.username = 'Minimum 6 characters'
  }
})
```

#### 4. 需要自动清理的异步操作

```js
watchEffect(onCleanup => {
  const timer = setInterval(() => {
    syncData()
  }, 5000)

  onCleanup(() => clearInterval(timer)) // 自动清理定时器
})
```

#### 5. 动态依赖场景

```js
// 根据条件动态决定依赖项
watchEffect(() => {
  if (useMetricSystem.value) {
    displayTemperature.value = celsius.value // 只追踪 celsius
  } else {
    displayTemperature.value = (celsius.value * 9) / 5 + 32 // 同样只追踪 celsius
  }
})
```

---

### 🛠 **决策矩阵**

| 特征                 | `watch`                      | `watchEffect`                  |
| -------------------- | ---------------------------- | ------------------------------ |
| **依赖声明方式**     | 显式声明                     | 自动收集                       |
| **首次执行时机**     | 默认惰性（可配置 immediate） | 立即执行                       |
| **旧值访问**         | ✔️ (newVal, oldVal)          | ❌                             |
| **多源监听**         | ✔️ (数组形式)                | 自动支持                       |
| **精确控制触发时机** | ✔️ (可配置 deep, flush 等)   | ❌（自动追踪所有访问到的属性） |
| **性能敏感场景**     | 更优（明确知道侦听目标）     | 需谨慎（可能追踪到意外依赖）   |
| **代码意图清晰度**   | 明确（代码即文档）           | 需要更多上下文理解             |

---

### 💡 **黄金法则**

1. 当需要 **明确知道哪些数据变化会触发副作用** 时，优先使用 `watch`
2. 当副作用 **依赖关系复杂、动态或难以预测** 时，优先使用 `watchEffect`
3. **两者可以混合使用**：在复杂场景中组合使用，例如用 `watch` 监听路由变化，同时在 `watchEffect` 中处理业务逻辑依赖

---

### ⚠️ **注意事项**

- **避免在 watchEffect 中修改依赖源**：可能导致无限循环
- **异步操作的清理**：两者都支持 `onCleanup` 回调，但 `watchEffect` 的自动重新执行特性需要特别注意竞态问题
- **避免巨型 watchEffect**：保持回调函数精简，否则依赖追踪会变得难以预测

```js
// 最佳实践：拆分 watchEffect
// Bad ❌
watchEffect(() => {
  // 处理用户数据
  // 处理订单数据
  // 处理页面状态
})

// Good ✅
watchEffect(handleUserData)
watchEffect(handleOrderData)
watchEffect(handleUIState)
```

根据具体场景灵活选择，可以显著提升代码的可维护性和性能表现。

## watchEffect 异步问题

### 异步导致依赖收集问题

在 watchEffect 中，Vue 会在执行回调函数时自动追踪其中使用的所有响应式依赖。只有当函数中 实际访问 了响应式数据，Vue 才会将该数据注册为依赖项。

```
watchEffect((onCleanup) => {
  // console.log(`监听了 x=${x.value}`)
  const timer = setTimeout(() => {
    console.log(`x=${x.value} 变化了`)
  }, 1000)
  onCleanup(() => {
    console.log(`清除了定时器`)
    clearTimeout(timer)
  })
})
```

这里可以看到监听的响应式数据位于异步回调中，最终会导致无法响应数据变化

原因如下：

1. 依赖收集时机 ：Vue 只会在 watchEffect 回调函数的 同步执行部分 收集依赖，而不会追踪在异步回调（如 setInterval 内部）中访问的响应式数据。
2. 关键依赖声明 ： console.log( 开始监听 x=${x.value} ) 这行代码在 watchEffect 的同步部分直接访问了 x.value ，因此 Vue 将其注册为依赖。
3. 注释后的影响 ：如果注释掉这行，watchEffect 的同步部分就不再访问 x.value ，所以 Vue 不会将其注册为依赖。
4. setInterval 中的访问无效 ：虽然 setInterval 回调中仍然访问了 x.value，但这是在异步回调中，Vue 不会在这里收集依赖。
5. 结果 ：当 x.value 变化时，由于它不是 watchEffect 的依赖项，所以不会触发 watchEffect 重新执行，也就不会执行 onCleanup 函数。
   这是 Vue 响应式系统的设计特点，确保了只有真正在同步代码中使用的响应式数据才会被追踪，避免了不必要的重新计算。

### 处理异步回调内部依赖的方法

#### 1. 在同步代码中引用响应式数据

最简单的解决方案是确保在 watchEffect 的同步部分引用所有需要监听的响应式数据：

```javascript
watchEffect(onCleanup => {
  // 在同步代码中引用 x.value，确保它被收集为依赖
  const currentX = x.value

  const timer = setTimeout(() => {
    console.log(`x=${currentX} 变化了`)
  }, 1000)

  onCleanup(() => {
    console.log(`清除了定时器`)
    clearTimeout(timer)
  })
})
```

#### 2. 使用 ref 作为中间变量

```javascript
watchEffect(onCleanup => {
  // 将响应式数据赋值给一个变量，确保依赖被收集
  const xValue = x.value

  const timer = setTimeout(() => {
    console.log(`x=${xValue} 变化了`)
  }, 1000)

  onCleanup(() => {
    console.log(`清除了定时器`)
    clearTimeout(timer)
  })
})
```

#### 3. 使用 watch 代替 watchEffect

对于这种情况，使用 watch 可能更加明确，因为它允许你显式声明要监听的响应式数据：

```javascript
watch(x, (newValue, oldValue) => {
  const timer = setTimeout(() => {
    console.log(`x=${newValue} 变化了`)
  }, 1000)

  return () => {
    console.log(`清除了定时器`)
    clearTimeout(timer)
  }
})
```

#### 4. 使用计算属性

如果逻辑较复杂，可以考虑使用计算属性：

```javascript
const derivedValue = computed(() => {
  // 这里引用 x.value，确保依赖被正确收集
  return someCalculation(x.value)
})

watchEffect(onCleanup => {
  // 引用计算属性，间接监听 x
  const value = derivedValue.value

  const timer = setTimeout(() => {
    console.log(`计算值=${value} 变化了`)
  }, 1000)

  onCleanup(() => {
    console.log(`清除了定时器`)
    clearTimeout(timer)
  })
})
```

### 总结

Vue 的响应式系统只会在同步代码执行期间收集依赖，这是出于性能和可预测性考虑的设计决策。当需要在异步回调中使用响应式数据时，必须确保这些数据在同步代码中被引用，以便正确建立依赖关系。

这种设计有助于避免不必要的重新计算和潜在的内存泄漏，但确实需要开发者对响应式系统的工作原理有更深入的理解。
