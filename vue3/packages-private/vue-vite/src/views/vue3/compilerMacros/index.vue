<template>
    <p>{{ msg }}</p>
    <button @click="changeTitle">change title</button>
    <DefineProps :title="title" />
    <DefineEmits @some-event="childEmitHandler" @change="childChange" />
    <DefineEmits @some-event="childEmitHandler" @change="(v: any) => msg += v" />
    <DefineOptions class="large" style="background: red;" @click="clickHandler" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DefineProps from './defineProps.vue'
import DefineEmits from './defineEmits.vue'
import DefineOptions from './defineOptions.vue'

const msg = ref<string>('')

const title = ref('hello world')
const changeTitle = () => {
    title.value += '!'
}

const childEmitHandler = (val: string) => {
    console.log('childEmitHandler: ', val);
}

const childChange = (val: any) => {
    console.log('childChange: ', val);
}

const clickHandler = () => {
    console.log('clickHandler');
}
</script>
