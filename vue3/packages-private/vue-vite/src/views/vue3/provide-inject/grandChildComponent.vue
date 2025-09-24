<template>
  <div id="grandChildComponent">
    <h4>grandChildComponent</h4>
    <button @click="consoleVm">console grandChildComponent</button>
    <p>
      inject title from parentComponent :
      <b>
        <i>{{ title }}</i>
      </b>
    </p>
    <p>
      computed title 
      <b>
        <i>{{ computedTitle }}</i>
      </b>
    </p>
    <p>
      inject count from parentComponent :
      <b>
        <i>{{ count }}</i>
      </b>
    </p>
    <p :style="{ color: color }">
      inject color from parentComponent :
      <b>
        <i>{{ color }}</i>
      </b>
    </p>
    <p :style="{ color: propsColor }">
      inject propsColor from parentComponent :
      <b>
        <i>{{ propsColor }}</i>
      </b>
    </p>

    <slot></slot>
  </div>
</template>

<script setup>
import { inject, computed, getCurrentInstance } from "vue";
const title = inject("title");
const computedTitle = computed(() => title.value + "!");

const count = inject("count");

const color = inject("color");

const propsColor = inject("propsColor");


/* inject-provide 当出现组件嵌套的情况，适用 就近原则 */
const parentComponent = inject("parentComponent");
const grandChildComponent = getCurrentInstance();
console.log("===debug=== grandChildComponent: ", grandChildComponent);
console.log("===debug=== parentComponent: ", parentComponent);

const consoleVm = () => {
  console.log("===debug=== grandChildComponent: ", grandChildComponent);
};
</script>

<style></style>
<style lang="scss" scoped>
#grandChildComponent {
  padding: 10px;
  border: 1px solid rgba(49, 153, 221, 0.632);
  background: rgba(49, 153, 221, 0.632);
  margin: 10px;
}
</style>
