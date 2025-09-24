<template>
    <div>
        <button @click="consoleVm" ref="btn">console vm</button>
        <Comp></Comp>
    </div>
</template>

<script setup>
import Comp from './Comp.vue'
import { reactive, getCurrentInstance, resolveComponent, KeepAlive } from 'vue';

const obj = reactive({})

console.log('===debug=== this: ', this); //可以看到这里的 this 是 undefined

const instance = getCurrentInstance()
console.log('===debug=== instance: ', instance);


const { proxy, ctx } = instance
console.log('===debug=== proxy: ', proxy);

const consoleVm = () => {
    const _instance = getCurrentInstance()
    console.log('===debug=== proxy: ', proxy);
    console.log('===debug=== instance: ', instance);
    console.log('===debug=== ctx: ', ctx);
    console.log('===debug=== instance.refs.btn: ', instance.refs.btn);
    console.log('===debug=== instance.appContext.components: ', instance.appContext.components); // 可以看到这里的组件已经被注册了，但是不包含vue3的内置组件 KeepAlive、Transition、Teleport
    console.log(`===debug=== resolveComponent('KeepAlive'): `, KeepAlive);
    console.log('===debug=== instance.setupState: ', instance.setupState);
    console.log('===debug=== instance.setupState.obj === obj: ', instance.setupState.obj === obj);
    console.log('===debug=== this: ', this); // this 是 undefined
    console.log('===debug=== _instance: ', _instance); // 这里的 _instance 是 null

}


/* https://cn.vuejs.org/api/component-instance#data */

/*note: 【获取上下文对象】
Vue3 的 setup 中无法使用 this 这个上下文对象，但是如果我想使用 this 上的属性和方法应该怎么办呢。虽然不推荐这样使用，但依然可以通过 getCurrentInstance 方法获取上下文对象：

注意

ctx 只能在开发环境使用，生成环境为 undefined 。 推荐使用 proxy ，在开发环境和生产环境都可以使用。

import { getCurrentInstance } from 'vue'
// 以下两种方法都可以获取到上下文对象
const { ctx } = getCurrentInstance()
const { proxy }  = getCurrentInstance()
\
*/


/* 
https://www.cnblogs.com/magicg/p/16643541.html
*/

/* 

使用 getCurrentInstance 函数返回当前组件的实例对象有一定的限制和规则需要遵守。特别是在 <script setup> 语法中，获取当前组件实例的方式与普通的 <script> 标签中有所不同。这里有几个关键点需要注意，以解释为什么 root 和 _root 行为不同：

1. <script setup> 与 getCurrentInstance
在 Vue 3 中，<script setup> 是一种更声明式的组件语法，它使得组件编写更简洁。但是，getCurrentInstance 在 <script setup> 中的表现与在常规 <script> 中略有不同，尤其是在组件的生命周期的某些阶段：

在 setup 函数外部调用 getCurrentInstance：当在 <script setup> 中直接调用 getCurrentInstance（如在顶层代码中），它通常可以正确返回当前组件的实例。这是因为 <script setup> 本质上是在 setup() 函数的上下文中执行的。

在事件处理函数或方法中调用 getCurrentInstance：如果你在事件处理器或其他方法内部（如 consoleRoot 方法内）调用 getCurrentInstance，此时可能返回 null。这通常发生在方法内部的执行上下文与组件实例的创建上下文不同步的情况下。

2. 解决方案和建议
为了确保在任何上下文中都能获取到当前的组件实例，最好的做法是在 setup() 函数或 <script setup> 的顶层代码中获取并保存这个实例，然后在需要的地方使用这个保存的引用。你的代码中已经这样做了：

javascript
复制代码
const root = getCurrentInstance();
并在你的 consoleRoot 方法中使用这个保存的实例：

javascript
复制代码
const consoleRoot = () => {
  console.log('===debug=== root: ', root);
};
这是正确的做法。关于 _root 是 null 的问题，确保在调用 consoleRoot 方法时组件已经被正确初始化并挂载。如果在组件的生命周期还未完全初始化完成时调用 getCurrentInstance，比如在一些异步操作或延迟执行的函数中，可能会得到 null。

3. 实际应用
在实际应用中，如果你需要在事件处理器或任何其他非顶层代码中访问组件实例，总是使用在顶层获取并保存的实例变量（如 root），而不是再次调用 getCurrentInstance。这样可以避免在组件生命周期的不同阶段遇到获取实例为 null 的问题。

总之，getCurrentInstance 返回 null 可能是由于它被调用的上下文（特别是在组件生命周期的某些阶段）不允许访问到组件实例。遵循在顶层一次获取实例并在其他地方引用这一实践，可以确保你的代码的稳定性和可靠性。
*/

</script>

<style></style>