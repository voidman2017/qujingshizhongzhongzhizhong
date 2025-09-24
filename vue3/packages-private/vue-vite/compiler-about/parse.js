import { baseParse } from '../../../packages/compiler-core/dist/compiler-core.cjs.js'

const { descriptor } = baseParse(`<template><div/></template>`)

console.log(descriptor)
