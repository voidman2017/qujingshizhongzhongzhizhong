<template>
  <el-card>
    <template #header> 鼠标 useMouse </template>
    <p>x: {{ x }}</p>
    <p>y: {{ y }}</p>
  </el-card>
</template>

<script setup>
import { useMouse } from '@vueuse/core'

// 跟踪鼠标位置
const { x, y } = useMouse()
</script>
