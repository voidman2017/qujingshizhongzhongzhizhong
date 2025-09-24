/* eslint-disable */
import { ref, onUnmounted } from 'vue'
import throttle from 'lodash-es/throttle'
import debounce from 'lodash-es/debounce'

type FlowControlMode =
  | { type: 'normal'; immediate?: boolean } // 新增 immediate 选项
  | { type: 'throttle'; wait: number }
  | { type: 'debounce'; wait: number; leading?: boolean }
type FlowActionOptions = {
  /** 防重复点击（默认跟随模式逻辑） */
  preventReclick?: boolean
  /** 自动 Loading 状态（默认 true） */
  autoLoading?: boolean
  /** 流控模式配置 */
  flowControl?: FlowControlMode
  /** 状态重置延迟（ms） */
  resetDelay?: number
  waitActionComplete?: boolean
}
export function useFlowAction(
  asyncAction: () => Promise<void> | void,
  options: FlowActionOptions = {},
) {
  const isLoading = ref(false)
  const isDisabled = ref(false)
  let cleanupFn: (() => void) | null = null
  // 参数处理（语义化默认值）
  let {
    autoLoading = true,
    flowControl = { type: 'normal', immediate: true },
    resetDelay = 300,
    preventReclick,
    waitActionComplete = true,
  } = options
  // 核心执行逻辑
  const {
    type: flowControlType = 'normal',
    immediate: flowControlImmediate = true,
  } = flowControl
  preventReclick =
    flowControlType === 'normal'
      ? !flowControlImmediate // 普通模式默认根据 immediate 反选
      : true

  const execute = waitActionComplete
    ? async () => {
        if (isDisabled.value) return
        try {
          if (autoLoading) isLoading.value = true
          if (preventReclick) isDisabled.value = true // 取消注释，启用防重复点击
          await asyncAction()
        } finally {
          if (resetDelay > 0) {
            setTimeout(() => {
              isLoading.value = false
              isDisabled.value = false
            }, resetDelay)
          } else {
            isLoading.value = false
            isDisabled.value = false
          }
        }
      }
    : () => {
        if (isDisabled.value) return
        try {
          if (autoLoading) isLoading.value = true
          if (preventReclick) isDisabled.value = true // 取消注释，启用防重复点击
          asyncAction()
        } finally {
          if (resetDelay > 0) {
            setTimeout(() => {
              isLoading.value = false
              isDisabled.value = false
            }, resetDelay)
          } else {
            isLoading.value = false
            isDisabled.value = false
          }
        }
      }
  // 流控处理
  let wrappedExecute = execute
  if (flowControlType !== 'normal') {
    const { type, wait } = flowControl
    wrappedExecute =
      type === 'throttle'
        ? throttle(execute, wait)
        : debounce(execute, wait, flowControl.leading)
    cleanupFn = () => {
      if ('flush' in wrappedExecute) {
        ;(wrappedExecute as any).flush?.()
      }
    }
  }
  onUnmounted(() => cleanupFn?.())
  // 处理点击事件
  const handleClick = () => {
    if (flowControlType === 'normal' && flowControlImmediate) {
      execute() // 普通模式立即执行
    } else {
      wrappedExecute()
    }
  }
  return { handleClick, isLoading, isDisabled }
}
