<template>
    <button @click="clickHandler" :class="type">You click me <span>{{ count }}</span> times</button>
</template>

<script>
import { ref } from 'vue'
export default {
    emits: ['clickHandler'],
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    setup(props, ctx) {
        const count = ref(0)
        const clickHandler = () => {
            count.value++
            ctx.emit('clickHandler', count.value)
        }
        return {
            count,
            clickHandler
        }
    }
}
</script>


<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const emit = defineEmits(['clickHandler'])
const props = defineProps({
    type: {
        type: String,
        default: 'danger'  // 恢复默认值
    }
})

const count = ref(3)  // 使用第二个script的初始化值
const clickHandler = () => {
    count.value += 2
    emit('clickHandler', count.value)
}
</script>


<style lang="scss" scoped>
button {
    display: block;
    padding: 8px 16px;
    margin: 6px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3d8b40;
    }

    span {
        color: #e282b5;
    }
}

.primary {
    background-color: #4CAF50;
}

.danger {
    background-color: #ff4444;
}
</style>