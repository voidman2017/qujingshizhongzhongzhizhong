/* eslint-disable */
import { customRef } from 'vue'

export function useDebounceRef(initialValue: string, delay: number) {
  let timer: number | null = null
  let value = initialValue

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue: string) {
      // 立即更新值，使输入框响应及时
      value = newValue
      trigger() // 立即触发更新

      // 清除之前的定时器
      if (timer) {
        clearTimeout(timer)
      }

      // 设置新的定时器来处理搜索逻辑
      timer = setTimeout(() => {
        // 在这里发起搜索请求
        console.log('开始搜索:', newValue)
      }, delay)
    },
  }))
}
