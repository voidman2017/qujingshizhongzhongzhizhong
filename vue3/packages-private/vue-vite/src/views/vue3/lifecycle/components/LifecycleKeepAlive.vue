<template>
    <div class="container">
        <p v-for="(lifecycle, index) in lifecyclesRun" :key="index" :class="lifecycle.name">{{ lifecycle.type }} - {{
            lifecycle.name }}
        </p>
        <button @click="view++">change comp</button>
        <keep-alive>
            <Comp v-if="view % 2" compName="组件1" @lifeCycleRun="ChildLifecycleRun"></Comp>
            <Comp v-else compName="组件2" @lifeCycleRun="ChildLifecycleRun"></Comp>
        </keep-alive>
    </div>

</template>

<script setup>
import Comp from './Comp.vue'
import { ref, onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onErrorCaptured, onRenderTracked, onRenderTriggered, onActivated, onDeactivated } from 'vue'
const lifecyclesRun = ref([])
const view = ref(0)

const lifecycles = [
    { name: 'onBeforeMount', fn: onBeforeMount, effect: false, log: true },
    { name: 'onMounted', fn: onMounted, effect: false, log: true },
    { name: 'onBeforeUpdate', fn: onBeforeUpdate, effect: false, log: true },
    { name: 'onUpdated', fn: onUpdated, effect: true, log: true },
    { name: 'onErrorCaptured', fn: onErrorCaptured, effect: false, log: true },
    { name: 'onRenderTracked', fn: onRenderTracked, effect: true, log: false },
    { name: 'onRenderTriggered', fn: onRenderTriggered, effect: true, log: false },
    { name: 'onActivated', fn: onActivated, effect: false, log: true },
    { name: 'onDeactivated', fn: onDeactivated, effect: false, log: true },
    { name: 'onUnmounted', fn: onUnmounted, effect: false, log: true }
]

lifecycles.forEach((lifecycle) => {
    lifecycle.fn(() => {
        lifecycle.log && console.log(`KeepAlive - ${lifecycle.name} is running`)
        !lifecycle.effect && lifecyclesRun.value.push({ name: lifecycle.name, type: 'KeepAlive' }) // 其中 onUpdated、 onRenderTracked、 onRenderTriggered 如果产生视图更新，则会导致循环执行
    })
})

const ChildLifecycleRun = (lifeCycleName, compName) => {
    lifecyclesRun.value.push({ name: lifeCycleName, type: compName })
}

</script>

<style lang="scss" scoped>
$color-onBeforeMount: #a73e3e;
$color-onMounted: #3eb729;
$color-onUpdated: #6057b2;
$color-onUnmounted: #a1d93a;
$color-onBeforeUpdate: #3fe2c4;
$color-onErrorCaptured: #ef8d04;
$color-onRenderTracked: #f00af4;
$color-onRenderTriggered: #fb2c2c;
$color-onActivated: #a6d4f5;
$color-onDeactivated: #061f19;

.container {
    border: 1px solid chocolate;
    padding: 10px;
    margin: 10px;
}

.onBeforeMount {
    color: $color-onBeforeMount;
}

.onMounted {
    color: $color-onMounted;
}

.onUpdated {
    color: $color-onUpdated;
}

.onUnmounted {
    color: $color-onUnmounted;
}

.onBeforeMount {
    color: $color-onBeforeMount;
}

.onBeforeUpdate {
    color: $color-onBeforeUpdate;
}

.onErrorCaptured {
    color: $color-onErrorCaptured;
}

.onRenderTracked {
    color: $color-onRenderTracked;
}

.onRenderTriggered {
    color: $color-onRenderTriggered;
}

.onActivated {
    color: $color-onActivated;
}

.onDeactivated {
    color: $color-onDeactivated;
}
</style>