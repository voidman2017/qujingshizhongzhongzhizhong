# vue3中vnode至真实dom树构建

通过document-proxy.ts执行结果的日志来看，vue3中对于子节点的插入操作主要是通过 insertBefore 实现，并没有使用 appendChild。 分析 packages/runtime-core/src/renderer.ts, 其中均使用了 hostInsert 实现节点插入


对比vue2中 vue/src/core/vdom/patch.js ，其中会使用 nodeOps.appendChild


https://deepwiki.com/search/vue3_26718f15-1350-4f2e-a0f2-0ff2334a006c
