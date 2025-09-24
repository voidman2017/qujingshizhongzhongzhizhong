<template>
    <div>
        <!-- <p v-for="(lifecycle, index) in lifecyclesRun" :key="index" :class="lifecycle">{{ lifecycle }}</p> -->
        <p>this is {{ compName }}</p>
        <input type="text" placeholder="please input something">
    </div>
</template>

<script setup>
import {
    ref, onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate,
    onErrorCaptured, onRenderTracked, onRenderTriggered, onActivated, onDeactivated
} from 'vue'
const props = defineProps({
    compName: {
        type: String,
        default: `comp - ${Math.floor(Math.random() * 100)}`
    }
})
const lifecyclesRun = ref([])
const emit = defineEmits(['lifeCycleRun'])
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
        lifecycle.log && console.log(`${props.compName} - ${lifecycle.name} is running`)
        if (!lifecycle.effect) {
            // 其中 onUpdated、 onRenderTracked、 onRenderTriggered 如果产生视图更新，则会导致循环执行
            lifecyclesRun.value.push(`${props.compName} - ${lifecycle.name}`)
            emit('lifeCycleRun', lifecycle.name, props.compName)
        }
    })
})



const count = ref(0)
const addCount = () => {
    count.value++
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