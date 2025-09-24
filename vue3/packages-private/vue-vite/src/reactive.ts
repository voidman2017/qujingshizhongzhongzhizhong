import { effect, reactive, watch } from 'vue'

const state = reactive({ count: 0 })
console.log('===debug=== state: ', state)

// 创建一个 effect
const effectFn = () => {
  console.log('count is:', state.count)
}
const runner = effect(effectFn)

// 修改状态会自动触发 effect 重新执行
state.count++ // 执行 effectFn , 输出: count is: 1

// 可以手动执行
runner() // 输出: count is: 1

runner.effect.run() // 输出: count is: 1

runner.effect.stop()

state.count++ // 此时不会执行 effectFn
