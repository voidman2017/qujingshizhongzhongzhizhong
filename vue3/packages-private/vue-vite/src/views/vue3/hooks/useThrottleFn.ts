import { customRef } from 'vue'

export default function useThrottleRef(initialValue: number, delay: number) {
  let timer: number | null = null
  let value = initialValue

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue: number) {
      if (!timer) {
        timer = setTimeout(() => {
          value = newValue
          trigger()
          timer = null
        }, delay)
      }
    },
  }))
}
