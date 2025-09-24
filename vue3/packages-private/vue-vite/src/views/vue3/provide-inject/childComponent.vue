<template>
  <div id="childComponent">
    <h3>childComponent</h3>
    <button @click="consoleVm">console childComponent</button>
  </div>
  <div class="arrow-down"></div>
  <!-- <grand-child-component></grand-child-component> -->
  <slot></slot>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import grandChildComponent from "./grandChildComponent.vue";

const childComponent = getCurrentInstance();
const consoleVm = () => {
  console.log("===debug=== childComponent: ", childComponent);
};
</script>

<style lang="scss" scoped>
#childComponent {
  padding: 10px;
  border: 1px solid rgb(232, 77, 232);
  background: rgb(232, 77, 232);
  margin: 10px;
}
</style>
