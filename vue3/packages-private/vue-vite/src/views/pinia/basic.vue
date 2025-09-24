<template>
  <el-card>
    <template #header> option mode </template>
    <div>count: {{ countOptionMode }}</div>
    <div>double: {{ doubleOptionMode }}</div>
    <el-button @click="incrementOptionMode">increment</el-button>
  </el-card>
  <el-card>
    <template #header> composition mode </template>
    <div>count: {{ countCompositionMode }}</div>
    <div>double: {{ doubleCompositionMode }}</div>
    <div>user: {{ userCompositionMode }}</div>
    <el-button @click="incrementCompositionMode">increment</el-button>
    <el-button @click="fetchUserCompositionMode">fetch user</el-button>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useUserStoreOptionMode,
  useUserStoreCompositionMode,
} from '../../pinia-store'

const userStoreOptionMode = useUserStoreOptionMode()
const { count: countOptionMode, double: doubleOptionMode } =
  storeToRefs(userStoreOptionMode) // 保持响应式
const { increment: incrementOptionMode } = userStoreOptionMode

const userStoreCompositionMode = useUserStoreCompositionMode()
const {
  count: countCompositionMode,
  double: doubleCompositionMode,
  user: userCompositionMode,
} = storeToRefs(userStoreCompositionMode) // 保持响应式
const {
  increment: incrementCompositionMode,
  fetchUser: fetchUserCompositionMode,
} = userStoreCompositionMode
</script>
