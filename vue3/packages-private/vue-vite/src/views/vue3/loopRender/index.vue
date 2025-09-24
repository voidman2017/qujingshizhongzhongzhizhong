<template>
  <div>
    <button @click="addItem">Add Item</button>
    <ul>
      <li
        class="index"
        v-for="(item, index) in list"
        :key="useIndexAsKey ? index : item"
      >
        <input type="text" placeholder="Enter something" />
        <span>{{ item.text }}</span>
        <button @click="deleteItem(index)">Delete</button>
      </li>
    </ul>

    <!-- <LoopRenderComponent
      :name="item.text"
      :index="index"
      v-for="(item, index) in list"
      :key="useIndexAsKey ? index : item"
      @delete="deleteItem"
    /> -->
  </div>
  <template>
    <!-- 如果要调试 sfc 文件编译结果的 renderCode， 关闭浏览器 调试工具的 「javascript source maps」 -->
    <!-- 由于 vue3 中 v-if 优先级高于 v-for，触发变量访问错误
      对应 renderCode 是： 
      ```
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return (
          _openBlock(),
          _createElementBlock("template", null, [
            !_ctx.todo.isComplete
              ? (_openBlock(true),
                _createElementBlock(
                  _Fragment,
                  {
                    key: 0,
                  },
                  _renderList($setup.list, (todo) => {
                    return (
                      _openBlock(),
                      _createElementBlock(
                        "li",
                        null,
                        _toDisplayString(todo.name),
                        1 /* TEXT */
                      )
                    );
                  }),
                  256 /* UNKEYED_FRAGMENT */
                ))
              : _createCommentVNode("v-if", true),
          ])
        );
      }
      ```
      可以看到先判断了 todo.isComplete 的值，然后根据值的不同，渲染对应内容。但是由于 _ctx.todo 是 undefined，所以会报错。
      -->
    <!-- <li v-for="todo in list" v-if="!todo.isComplete">
      {{ todo.name }}
    </li> -->
  </template>
</template>

<script setup>
import LoopRenderComponent from './LoopRenderComponent.vue'
import { ref, onUpdated } from 'vue'

const useIndexAsKey = false

const list = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
])

const todos = ref([
  { id: 1, text: 'Item 1', isComplete: false },
  { id: 2, text: 'Item 2', isComplete: true },
  { id: 3, text: 'Item 3', isComplete: false },
])

const addItem = () => {
  list.value.unshift({
    id: Date.now(),
    text: `Item ${list.value.length + 1}`,
  })
}

const deleteItem = index => {
  list.value.splice(index, 1)
}

onUpdated(() => {
  // console.log('loopRender-onUpdated')
})
</script>
// ... existing code ...
<style scoped>
div {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px 0;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button.delete {
  background-color: #f44336;
}

button.delete:hover {
  background-color: #d32f2f;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
}

li {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type='text'] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  flex: 1;
}

span {
  margin: 0 10px;
  font-size: 16px;
}
</style>
