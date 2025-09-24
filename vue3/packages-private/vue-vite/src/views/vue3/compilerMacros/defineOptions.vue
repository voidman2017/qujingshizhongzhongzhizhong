<template>
    <button class="btn" style="background:blue;" @click="clickHandler">inherit attrs button {{ $attrs }}</button>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
defineOptions({
    /* style合并时，相同属性会由继承的覆盖当前的 */
    inheritAttrs: true,
})

const instance = getCurrentInstance()
const { proxy, ctx } = instance

const clickHandler = () => {
    console.log('attrs:', ctx.$attrs)
    console.log('inherit attrs button click');
}
</script>