<template>
    <div>
        <button @click="$emit('someEvent')">Click Me</button>
        <button @click="change">send msg</button>
    </div>
</template>

<script setup lang="ts">
// const emit = defineEmits(['someEvent', 'change'])

/* const emit = defineEmits<{
    (e: 'someEvent'): void
    (e: 'change', val: string): void
}>() */

const emit = defineEmits({
    someEvent() { },
    change(payload: { val: string }) { }
})
const change = () => {
    emit('change', { val: 'hello world' })
}
</script>

<style></style>