<template>
  <div>
    <p>x:{{ x }}</p>
    <p>y:{{ y }}</p>
  </div>

  <button @click="handleClick">
    <span>提交订单</span>
  </button>

  <button @click="throttleClick" :disabled="isLoadingThrottle">
    <span v-if="isLoadingThrottle">提交中...</span>
    <span v-else>节流提交订单</span>
  </button>

  <button @click="debounceClick" :disabled="isLoadingDebounce">
    <span v-if="isLoadingDebounce">提交中...</span>
    <span v-else>防抖提交订单</span>
  </button>
</template>
<script setup lang="ts">
import { useMouse } from './useMouse'
import { useFlowAction } from './useFlowAction'

const { x, y } = useMouse()

const submitOrder = async () => {
  console.log('fetch start', Date.now())
  await new Promise(res => {
    setTimeout(() => {
      console.log('fetch finish', Date.now())
      res('data')
    }, 5000)
  })
}
// 1. 普通模式（默认）
const { handleClick } = useFlowAction(submitOrder, {
  flowControl: { type: 'normal' },
})

// 2. 节流模式（1秒间隔）
const { handleClick: throttleClick, isLoading: isLoadingThrottle } =
  useFlowAction(submitOrder, {
    flowControl: { type: 'throttle', wait: 1000 },
    waitActionComplete: false,
  })

// 3. 防抖模式（300ms延迟）
const { handleClick: debounceClick, isLoading: isLoadingDebounce } =
  useFlowAction(submitOrder, {
    flowControl: { type: 'debounce', wait: 300 },
    waitActionComplete: false,
  })
</script>
