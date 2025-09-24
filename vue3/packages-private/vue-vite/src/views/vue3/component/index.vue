<template>
  <ButtonCount @clickHandler="buttonCompClick" />
  <ButtonCount type="primary" />
  <ButtonCount type="danger" />
  <FunctionalComponent msg="this is function component" />
  <DefineFunctionComponent msg="defineComponent functional component" />
</template>

<script setup>
import ButtonCount from './ButtonCount.vue'
import { FunctionalComponent, DefineFunctionComponent } from './FunctionComp'

const buttonCompClick = num => {
  console.log('buttonCompClick', num)
}
</script>

<style></style>
