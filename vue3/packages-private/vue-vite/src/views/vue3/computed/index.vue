<template>
  <div class="computed-container">
    <el-card>
      <template #header>计算属性</template>
      <div class="input-section">
        <div class="form-item">
          <label>名:</label>
          <input v-model="firstName" />
        </div>
        <div class="form-item">
          <label>姓:</label>
          <input v-model="lastName" />
        </div>
        <div class="form-item">
          <label>全名：</label>
          <input v-model="fullName" />
        </div>
        <div class="form-item">
          <label>全名-setter：</label>
          <input v-model="fullNameWithSetter" />
        </div>
        <div class="form-item">
          <label>全名反转：</label>
          <input v-model="reversedFullName" />
        </div>
        <button @click="changeFullName">改变全名</button>
      </div>
      <div class="counter-section">
        <p>计数: {{ count }}</p>
        <p>双倍计数: {{ doubleCount }}</p>
        <button @click="count++">增加</button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 响应式数据
const firstName = ref('')
const lastName = ref('')
const count = ref(0)

// 计算属性
/* 
packages/reactivity/src/computed.ts 会根据 computed 接收的参数
1. 如果参数是函数，则设置 getter 为该函数
2. 如果参数是对象，则设置 getter 和 setter 分别为该对象的 get 和 set 方法
最终返回一个 computedRefImpl 实例
*/
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
console.log('computed fullName', fullName)

const fullNameWithSetter = computed({
  get(previousValue: string) {
    console.log(
      'fullNameWithSetter get',
      previousValue,
      firstName.value,
      lastName.value,
    )
    return firstName.value + ' ' + lastName.value
  },
  set(value: any) {
    console.log('fullNameWithSetter set', value)
    ;[firstName.value, lastName.value] = value.split(' ') // 副作用：修改了firstName和lastName的值。这里逻辑和 get 中是一致的，
    // ;[firstName.value, lastName.value] = value.split('@') // 副作用：修改了firstName和lastName的值。但是逻辑和 get 中不一致，导致结果不可预测。
  },
})

function changeFullName() {
  fullNameWithSetter.value = '111@222'
}

const reversedFullName = computed(() => {
  return fullName.value.split('').reverse().join('')
})

const doubleCount = computed(() => {
  return count.value * 2
})

// 错误示例：在computed中修改外部状态
const num = ref(0)
const doubleNum = computed(() => {
  num.value++ // 副作用：修改了count的值
  return num.value * 2
})
// 多次访问doubleCount会导致count被多次修改
console.log(num.value, doubleNum.value) // 输出 2 (count变为1)
console.log(num.value, doubleNum.value) // 输出 4 (count变为2) —— 结果不可预测！
console.log(num.value, doubleNum.value) // 输出 6 (count变为3) —— 结果不可预测！
</script>

<style scoped>
.computed-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.input-section,
.result-section,
.counter-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.form-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 80px;
}

button {
  padding: 5px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>
