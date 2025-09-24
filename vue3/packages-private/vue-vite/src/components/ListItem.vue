<template>
  <el-input v-model="inputValue" />
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
