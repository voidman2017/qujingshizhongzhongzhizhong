<template>
  <div id="parentComponent">
    <h2>parentComponent</h2>
    <p :style="{ color: color }">props.color: {{ color }}</p>
    <button @click="consoleVm">console parentComponent</button>
    <input type="text" v-model="title" />
    <button @click="changeCount">change count</button>
  </div>
  <div class="arrow-down"></div>
  <!-- <child-component /> -->
  <slot></slot>
</template>

<script setup>
import childComponent from "./childComponent.vue";
import {
  provide,
  reactive,
  ref,
  defineProps,
  getCurrentInstance,
  toRef,
} from "vue";

const props = defineProps({
  color: {
    type: String,
  },
});

const parentComponent = getCurrentInstance();
provide("parentComponent", parentComponent);
const consoleVm = () => {
  console.log("===debug=== parentComponent: ", parentComponent);
};

const title = ref("parentComponent");
provide("title", title);

let count = 1;
provide("count", count);
const changeCount = () => {
  count++;
  console.log("===debug=== count: ", count);
};

provide("color", props.color);
provide("propsColor", toRef(props, "color"));
</script>

<style lang="scss" scoped>
#parentComponent {
  border: 1px solid rgb(242, 153, 143);
  background: rgb(242, 153, 143);
  padding: 10px;
  margin: 10px;
}
</style>
