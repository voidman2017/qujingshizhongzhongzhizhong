<template>
  <div class="item-container">
    <input
      type="text"
      placeholder="Enter something"
      :value="name"
      class="input-field"
    />
    <span class="name-display">{{ compName }}</span>
    <button class="delete-button" @click="emit('delete', index)">Delete</button>
  </div>
</template>

<script setup>
import { onUpdated, onMounted, onUnmounted } from 'vue'
import { loopRenderComponentCount } from './LoopRenderComponentCount'

const props = defineProps({
  name: [String, Number],
  index: [Number],
})

const compName = loopRenderComponentCount.getCount()

const emit = defineEmits(['delete'])

onMounted(() => {
  console.log(`LoopRenderItem-onMounted,${compName}`)
})

onUnmounted(() => {
  console.log(`LoopRenderItem-onUnmounted,${compName}`)
})

onUpdated(() => {
  console.log(`LoopRenderItem-onUpdated,${compName}`)
})
</script>

<style scoped>
.item-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 0.5rem;
}

.input-field {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #4dabf7;
}

.name-display {
  color: #495057;
  font-size: 1rem;
}

.delete-button {
  padding: 0.5rem 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #fa5252;
}
</style>
