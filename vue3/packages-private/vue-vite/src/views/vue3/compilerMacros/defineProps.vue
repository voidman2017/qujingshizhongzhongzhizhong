<template>
    <h1>{{ title }}</h1>
</template>

<script setup>
import { watchEffect, watch, ref } from 'vue'
/* 响应式 Props 解构 */
const { title } = defineProps({
    title: {
        type: String,
        required: true,
    },
})
watchEffect(() => {
    /* 在 3.5 之前只运行一次
     在 3.5+ 中在 "foo" prop 变化时重新执行 */
    console.log('watchEffect-title: ', title);
})

/* 编译阶段报错：
"title" is a destructured prop and should not be passed directly to watch(). Pass a getter () => title instead. */
// watch(title, (val) => {
//     console.log('watch-title', val)
// })


/* 不允许子组件中修改 props */
// title = 'xxxx'


watch(() => title, (val) => {
    console.log('watch-title', val)
})

</script>



<style></style>