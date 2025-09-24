<template>
    <div>
        <button @click="show = !show">组件创建/销毁</button>
        <LifecycleParent v-if="show" />
    </div>
    <LifecycleKeepAlive />
</template>

<script setup>
import { ref } from 'vue'
import LifecycleParent from './components/LifecycleParent.vue'
import LifecycleKeepAlive from './components/LifecycleKeepAlive.vue'

const show = ref(true)

</script>
