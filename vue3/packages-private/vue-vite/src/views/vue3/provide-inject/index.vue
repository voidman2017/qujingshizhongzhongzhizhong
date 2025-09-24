<template>
  <h1>provide inject</h1>
  <label for="color1">color1:</label>
  <input type="text" name="color1" v-model="color1" />

  <label for="color2">color2:</label>
  <input type="text" name="color2" v-model="color2" />

  <parentComponent :color="color1">
    <childComponent>
      <grandChildComponent>
        <parentComponent :color="color2">
          <childComponent>
            <grandChildComponent></grandChildComponent>
          </childComponent>
        </parentComponent>
      </grandChildComponent>
    </childComponent>
  </parentComponent>
</template>

<script setup>
import { ref } from "vue";
import parentComponent from "./parentComponent.vue";
import childComponent from "./childComponent.vue";
import grandChildComponent from "./grandChildComponent.vue";

const color1 = ref("green");
const color2 = ref("red");
</script>

<style scoped></style>
