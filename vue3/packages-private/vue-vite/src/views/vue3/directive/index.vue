<template>
    <p v-highlight v-color:fontColor.opacity.start="'red'">This sentence is important!</p>
    <input type="text" v-focus v-model="inputVal">
    <button @click="changeInputVal">change input value</button>
</template>

<script setup>
import { ref } from 'vue'
import { vFocus, vColor } from './custom-directives.ts'
const vHighlight = {
    mounted: (el) => {
        el.classList.add('is-highlight')
    }
}


const inputVal = ref('')
const changeInputVal = () => {
    inputVal.value += '!'
}


</script>

<style lang="scss">
.is-highlight {
    background: rgb(232, 162, 162);
}

input:focus {
    outline: none;
    border: 1px solid rgb(230, 62, 95);
}
</style>