<template>
  <!-- 如果需要调试 template 的 render code ，把 chrome 的 Javascript source maps 关闭 -->
  <div class="conditional-container">
    <el-card>
      <template #header>条件渲染</template>
      <div class="section">
        <h3>v-if 示例</h3>
        <div class="control-panel">
          <el-switch v-model="showVIf" active-text="显示" inactive-text="隐藏" />
        </div>
        <div class="result-panel">
          <div v-if="showVIf" class="demo-box">
            v-if 内容 - 元素会被完全移除
          </div>
          <div v-else class="demo-box alt">v-else 内容 - 显示替代内容</div>
        </div>

        <div class="explanation">
          <p>
            v-if
            是"真正的"条件渲染，它会确保条件块内的事件监听器和子组件在切换时被销毁和重建。
          </p>
          <p>v-if 是惰性的：如果在初始渲染时条件为 false，则不会做任何事情。</p>
        </div>
      </div>

      <div class="section">
        <h3>v-show 示例</h3>
        <div class="control-panel">
          <el-switch v-model="showVShow" active-text="显示" inactive-text="隐藏" />
        </div>
        <div class="result-panel">
          <div v-show="showVShow" class="demo-box">
            v-show 内容 - 元素仅通过 CSS display 属性隐藏
          </div>
        </div>

        <div class="explanation">
          <p>v-show 只是简单地切换元素的 CSS 属性 display。</p>
          <p>
            v-show 不管初始条件如何，元素总是会被渲染，只是简单地基于 CSS
            进行切换。
          </p>
        </div>
      </div>

      <div class="section">
        <h3>v-if 与 v-for</h3>
        <div class="control-panel">
          <el-switch v-model="showList" active-text="显示列表" inactive-text="隐藏列表" />
        </div>
        <div class="result-panel">
          <template v-if="showList">
            <div v-for="item in items" :key="item.id" class="list-item">
              {{ item.text }}
            </div>
          </template>
          <div v-else class="demo-box alt">列表已隐藏</div>
        </div>
      </div>

      <div class="section">
        <h3>v-if/v-else-if/v-else</h3>
        <div class="control-panel">
          <el-radio-group v-model="condition">
            <el-radio :label="1">条件 1</el-radio>
            <el-radio :label="2">条件 2</el-radio>
            <el-radio :label="3">其他条件</el-radio>
          </el-radio-group>
        </div>
        <div class="result-panel">
          <div v-if="condition === 1" class="demo-box">条件 1 满足</div>
          <div v-else-if="condition === 2" class="demo-box alt">
            条件 2 满足
          </div>
          <div v-else class="demo-box alt-2">没有条件满足，显示默认内容</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// v-if 示例数据
const showVIf = ref(true)

// v-show 示例数据
const showVShow = ref(true)

// v-if 与 v-for 示例数据
const showList = ref(true)
const items = ref([
  { id: 1, text: '列表项 1' },
  { id: 2, text: '列表项 2' },
  { id: 3, text: '列表项 3' },
])

// v-if/v-else-if/v-else 示例数据
const condition = ref(1)
</script>

<style scoped>
.conditional-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.section:last-child {
  border-bottom: none;
}

.control-panel {
  margin-bottom: 15px;
}

.result-panel {
  min-height: 60px;
  margin-bottom: 15px;
}

.demo-box {
  padding: 15px;
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
}

.alt {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
}

.alt-2 {
  background-color: #f0f2f5;
  border: 1px solid #e6e8eb;
}

.explanation {
  font-size: 14px;
  color: #606266;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
}

.list-item {
  padding: 10px;
  margin-bottom: 5px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
}
</style>
