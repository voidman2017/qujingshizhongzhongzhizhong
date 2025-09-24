# vue3中应用 lru
## compiler
node-lru-cache 库实现了最近最少使用 （LRU）（Least Recently Used） 缓存 - 一种维护有限键值对集合的数据结构，在需要空间时自动删除最近访问最少的项目。它旨在在 Node.js 环境中以最小的开销提供高效的缓存。


vue3在compiler模块中使用了该库实现缓存功能createCache封装 packages/compiler-sfc/src/cache.ts:3，其中使用到了 lru-cache 库

在 packages/compiler-sfc/src/parse.ts:107 parse 方法中，会先进行是否存在缓存判断 parseCache.get ，如果存在则直接返回；否则进行 ast 解析，并进行缓存。

## keep-alive


# lru实现
下面是一个基于 **JavaScript** 的 LRU 缓存实现，采用 **Map + 双向链表** 的方式，确保高效的插入、查找和删除操作，并完整支持 LRU 策略的核心逻辑。

---

## ✅ 实现目标

- 使用 LRU 策略管理缓存，当缓存满时删除 **最久未使用的元素**。
- 支持 `get(key)` 和 `put(key, value)` 操作。
- 时间复杂度：`O(1)`（查找、插入、删除）。

---

## 🧠 核心数据结构

- **Map**：用于存储缓存的键值对，支持快速查找。
- **双向链表**：用于维护访问顺序，最近使用的放在头部，最久未使用的放在尾部。

---

## 🧩 实现代码

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new Node(); // 头节点（最近使用）
        this.tail = new Node(); // 尾节点（最久未使用）

        // 初始化双向链表的头尾连接
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // 获取缓存项
    get(key) {
        if (!this.cache.has(key)) return -1;

        const node = this.cache.get(key);
        this.moveToHead(node); // 访问后移到头部
        return node.value;
    }

    // 添加/更新缓存项
    put(key, value) {
        if (this.cache.has(key)) {
            // 已存在，更新值并移到头部
            const node = this.cache.get(key);
            node.value = value;
            this.moveToHead(node);
        } else {
            // 不存在，新建节点并插入头部
            const newNode = new Node(key, value);
            this.cache.set(key, newNode);
            this.addToHead(newNode);

            // 如果超出容量，删除尾部节点
            if (this.cache.size > this.capacity) {
                const removedNode = this.removeTail();
                this.cache.delete(removedNode.key);
            }
        }
    }

    // 将节点移到头部
    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }

    // 删除节点
    removeNode(node) {
        const prev = node.prev;
        const next = node.next;
        prev.next = next;
        next.prev = prev;
    }

    // 添加节点到头部
    addToHead(node) {
        const next = this.head.next;
        this.head.next = node;
        node.prev = this.head;
        node.next = next;
        next.prev = node;
    }

    // 删除尾部节点（不包括虚拟尾节点）
    removeTail() {
        const realTail = this.tail.prev;
        this.removeNode(realTail);
        return realTail;
    }
}

// 定义双向链表节点
class Node {
    constructor(key = null, value = null) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
```

---

## ✅ 使用示例

```javascript
const lru = new LRUCache(2); // 容量为 2

lru.put(1, 'one');
lru.put(2, 'two');
console.log(lru.get(1)); // 输出 'one'，并将其移到头部
lru.put(3, 'three');     // 容量满，删除最久未使用的 'two'
console.log(lru.get(2)); // 输出 -1（已被删除）
```

---

## 🧪 补充说明

| 方法       | 作用                   | 时间复杂度 |
|------------|------------------------|-------------|
| `get(key)` | 获取缓存项，并将其移到头部 | O(1)        |
| `put(key)` | 添加或更新缓存项         | O(1)        |

---

## 📌 优势与适用场景

- **时间复杂度低**：所有操作均能在 O(1) 时间内完成。
- **空间利用率高**：仅保留最近使用的数据。
- **适用场景**：
  - Web 缓存
  - 数据库查询缓存
  - API 请求结果缓存

---

# vue3中lru应用
在 **Vue 3 的源码中**，确实有使用 **LRU（Least Recently Used）** 缓存策略，主要体现在 `<keep-alive>` 组件的实现中。以下是详细的源码解析和实现逻辑说明：

---

### **1. `<keep-alive>` 组件的 LRU 缓存**
#### **核心文件**
- **源码路径**：`packages/runtime-core/src/components/KeepAlive.ts`
- **核心数据结构**：
  - `cache`: 用于缓存组件实例的 Map。
  - `keys`: 用于维护组件实例的访问顺序（LRU 关键）。

#### **源码片段**
```typescript
const cache: Map<string, VNode> = new Map()
const keys: string[] = []

function pruneCache() {
  for (const key of keys) {
    if (!activeKeys.has(key)) {
      cache.delete(key)
      break
    }
  }
}
```

#### **LRU 实现逻辑**
1. **缓存管理**：
   - 使用 `Map` 存储组件实例（`cache`），键为组件的 `key`，值为组件实例。
   - 使用 `keys` 数组维护组件的访问顺序（越靠前表示越久未被使用）。

2. **缓存淘汰**：
   - 当缓存容量（由 `max` 属性指定）不足时，调用 `pruneCache()` 方法。
   - `pruneCache()` 会遍历 `keys` 数组，找到第一个不在当前活动组件集合（`activeKeys`）中的组件实例，并从 `cache` 中删除。
   - 这个过程模拟了 **LRU 策略**：删除最久未被访问的组件实例。

#### **LRU 特性验证**
- **访问顺序维护**：通过 `keys` 数组记录组件的访问顺序。
- **淘汰逻辑**：每次组件被激活时，将其 `key` 移动到 `keys` 数组末尾（标记为最近使用），而被淘汰的是数组最前面的项（最久未使用）。

---

### **2. 计算属性的缓存（非 LRU）**
Vue 3 的 **计算属性（`computed`）** 使用的是 **单结果缓存**，而非 LRU：
- **缓存机制**：仅缓存最近一次计算结果。
- **触发更新**：当依赖项变化时，缓存失效，重新计算并更新缓存。
- **源码位置**：`packages/reactivity/src/computed.ts`
- **核心代码**：
  ```typescript
  const computed = () => {
    if (dirty) {
      value = effectFn()
      dirty = false
    }
    return value
  }
  ```

---

### **3. 响应式系统的依赖追踪（非 LRU）**
Vue 3 的响应式系统通过 **依赖收集** 和 **触发更新** 实现缓存效果：
- **依赖收集**：每个响应式对象的 `getter` 会收集当前 `effect`（如组件渲染函数）作为依赖。
- **触发更新**：当响应式对象的值变化时，仅触发依赖它的 `effect` 更新。
- **源码位置**：`packages/reactivity/src/effect.ts`
- **核心逻辑**：
  ```typescript
  const effect = () => {
    // 依赖收集
    track(target, key)
    // 渲染逻辑
  }

  function trigger(target, key) {
    // 触发依赖的 effect 更新
  }
  ```

---

### **4. 模板编译缓存（非 LRU）**
Vue 3 的模板编译器会缓存 **渲染函数**，避免重复编译：
- **缓存机制**：使用 `Map` 缓存模板的 AST 和渲染函数。
- **源码位置**：`packages/compiler-dom/src/compile.ts`
- **核心代码**：
  ```typescript
  const compileCache = new Map<string, any>()
  function compile(template: string) {
    const cached = compileCache.get(template)
    if (cached) return cached
    // 编译逻辑
    compileCache.set(template, result)
  }
  ```

---

### **总结：Vue 3 中的缓存策略对比**

| 缓存类型           | 是否使用 LRU | 核心实现方式               | 作用场景                     |
|--------------------|--------------|----------------------------|------------------------------|
| `<keep-alive>`     | ✅ 是         | `Map + keys` 数组维护顺序  | 动态组件状态缓存             |
| 计算属性           | ❌ 否         | 单结果缓存                 | 避免重复计算                 |
| 响应式系统         | ❌ 否         | 依赖收集 + 惰性更新        | 精准触发组件更新             |
| 模板编译缓存       | ❌ 否         | `Map` 缓存渲染函数         | 避免重复编译模板             |

---

### **关键结论**
1. **Vue 3 显式使用 LRU 的唯一场景是 `<keep-alive>` 组件**，通过 `Map` 和 `keys` 数组模拟 LRU 淘汰策略。
2. 其他缓存机制（如计算属性、响应式系统、模板编译）并未使用 LRU，而是通过更简单的缓存策略（单结果缓存、依赖追踪等）优化性能。

如果需要进一步分析 `<keep-alive>` 的完整实现细节或调试源码，可以继续提问！

# 关联
除了 **LRU（Least Recently Used）** 之外，还有多种缓存淘汰策略（Cache Replacement Policies），每种策略适用于不同的场景。以下是常见的缓存策略及其特点：

---

### **1. FIFO（First In First Out）**
#### **核心思想**
- **先进先出**：删除最早进入缓存的数据（不考虑访问频率或最近使用时间）。
- **实现简单**：通常用队列维护顺序。

#### **优缺点**
- **优点**：实现简单。
- **缺点**：忽略数据的使用频率，可能导致频繁访问的数据被错误淘汰。

#### **适用场景**
- 对访问频率不敏感的场景，例如操作系统中的页面置换。

#### **示例**
```python
# 假设缓存容量为3
put(1, 'A') → [A]
put(2, 'B') → [A, B]
put(3, 'C') → [A, B, C]
put(4, 'D') → 删除最早进入的 A → [B, C, D]
```

---

### **2. LFU（Least Frequently Used）**
#### **核心思想**
- **最少使用**：删除访问次数最少的数据。
- **维护访问频率**：记录每个数据的访问次数，优先淘汰最低频次的数据。

#### **优缺点**
- **优点**：适合访问频率差异大的场景。
- **缺点**：
  - 实现复杂度高（需要维护频率计数器）。
  - 无法区分“长期低频”和“突发高频”的数据。

#### **适用场景**
- 高频访问的热点数据缓存（如数据库查询缓存）。

#### **示例**
```python
# 假设缓存容量为3
put(1, 'A') → [A:1]
get(1) → [A:2]
put(2, 'B') → [A:2, B:1]
put(3, 'C') → [A:2, B:1, C:1]
put(4, 'D') → 删除最低频次的 B/C → [A:2, C:1, D:1]
```

---

### **3. ARC（Adaptive Replacement Cache）**
#### **核心思想**
- **自适应**：动态调整 LRU 和 LFU 的比例，根据访问模式自动优化。
- **维护两个缓存**：
  - **T1**：基于 LRU（高频数据）。
  - **T2**：基于 LFU（低频数据）。
- **平衡高频与低频数据**。

#### **优缺点**
- **优点**：适应性强，性能优于 LRU。
- **缺点**：实现复杂，调试困难。

#### **适用场景**
- 复杂的缓存系统（如数据库、分布式存储）。

---

### **4. Clock（时钟）算法**
#### **核心思想**
- **近似 LRU**：使用一个环形链表（类似时钟指针）维护数据的使用状态。
- **标记位**：记录数据是否被访问过，当需要淘汰时，跳过已访问的数据。

#### **优缺点**
- **优点**：硬件实现简单（常用于操作系统页面置换）。
- **缺点**：性能不如 LRU 或 LFU。

#### **示例**
```text
缓存项列表：[A, B, C, D]
指针指向 A → 检查 A 的标记位：
- 如果标记位为 0 → 淘汰 A。
- 如果标记位为 1 → 将标记位设为 0，指针移动到下一个。
```

---

### **5. CAR（Clock with Adaptive Replacement）**
#### **核心思想**
- **改进的 Clock 算法**：结合 LRU 和 Clock 的优势，动态调整缓存策略。
- **维护两个队列**：
  - **A**：高频访问的数据。
  - **B**：低频访问的数据。

#### **优缺点**
- **优点**：比传统 Clock 算法更高效。
- **缺点**：实现复杂。

---

### **6. Bélády 算法（Optimal Algorithm）**
#### **核心思想**
- **理论最优**：预知未来访问顺序，删除未来最久不会被访问的数据。
- **实际不可行**：需要预知未来访问模式，仅用于理论研究。

#### **示例**
```text
假设未来访问序列为 [1, 2, 3, 4]，当前缓存已满 [1, 2, 3]。
删除 1（因为 1 是未来最久未被访问的）。
```

---

### **7. Random（随机淘汰）**
#### **核心思想**
- **随机选择**：从缓存中随机淘汰一个数据。
- **简单但低效**。

#### **适用场景**
- 对性能要求不高的场景（如测试或调试）。

---

### **8. GDSF（Greedy Dual Size First）**
#### **核心思想**
- **基于数据大小**：优先淘汰占用空间最大的数据。
- **适合异构数据**：数据大小差异较大的场景。

---

### **9. TwoQ（Two Queue）**
#### **核心思想**
- **双队列策略**：
  - **FQ**（FIFO 队列）：缓存新数据。
  - **LQ**（LRU 队列）：缓存高频数据。
- **迁移机制**：频繁访问的数据从 FQ 移动到 LQ。

---

### **10. LIRS（Low Inter-reference Recency Sampling）**
#### **核心思想**
- **基于访问间隔**：优先淘汰“长间隔未访问”的数据。
- **适合长尾数据**：优化冷数据的淘汰效率。

---

### **总结对比表**

| 策略       | 核心依据          | 优点                     | 缺点                       | 适用场景                     |
|------------|-------------------|--------------------------|----------------------------|------------------------------|
| **LRU**    | 最久未使用         | 实现简单，效率较高       | 无法处理突发高频访问       | 通用缓存场景                 |
| **LFU**    | 最少访问次数       | 适合访问频率差异大的场景 | 需要维护频率计数器         | 高频热点数据                 |
| **FIFO**   | 最早进入缓存       | 实现简单                 | 忽略访问频率               | 页面置换                     |
| **ARC**    | 自适应调整 LRU/LFU | 适应性强                 | 实现复杂                   | 复杂缓存系统                 |
| **Clock**  | 标记位 + 环形指针  | 硬件实现简单             | 性能不如 LRU/LFU           | 操作系统页面置换             |
| **Random** | 随机选择           | 实现极简                 | 无法保证命中率             | 测试或调试                   |
| **Bélády** | 未来访问预测       | 理论最优                 | 实际不可行                 | 理论研究                     |

---

### **如何选择策略？**
1. **通用场景**：使用 **LRU**（简单高效）。
2. **高频数据**：使用 **LFU**（优化热点数据）。
3. **复杂系统**：使用 **ARC**（自适应调整）。
4. **硬件限制**：使用 **Clock**（适合嵌入式系统）。
5. **理论研究**：使用 **Bélády**（评估其他策略性能）。

# 参考
https://juejin.cn/post/7098299715846373389
https://zhuanlan.zhihu.com/p/34989978
https://juejin.cn/post/6844904049263771662