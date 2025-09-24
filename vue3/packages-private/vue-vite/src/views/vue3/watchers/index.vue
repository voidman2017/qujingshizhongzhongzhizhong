<template>
  <input type="text" v-model="search" placeholder="请输入搜索商品" />
  <ul v-if="!isLoading">
    <li v-for="item in searchResult" :key="item">
      {{ item.product }}
    </li>
  </ul>
  <div class="loading" v-else>searching...</div>

  <div>
    <div>x: {{ watchSingleX }}</div>
    <div>sum of x + y: {{ watchGetter }}</div>
    <div>sum of x + y: {{ watchMultiple }}</div>
    <div>reactive mousePosition: {{ mousePosition }}</div>
    <div>watchMousePositionX: {{ watchMousePositionX }}</div>
    <div>watchMousePositionY: {{ watchMousePositionY }}</div>
  </div>

  <div>
    <button @click="stopWatch">停止监听</button>
  </div>
  <div>
    <router-link to="/">home</router-link>
  </div>
</template>
<script setup>
import { watch, watchEffect, ref, reactive, onMounted, onUnmounted } from 'vue'
const search = ref('')
const searchResult = ref([])
const isLoading = ref(false)
const x = ref(0)
const y = ref(0)
const watchSingleX = ref(0)
const watchGetter = ref(0)
const watchMultiple = ref(0)
const mousePosition = reactive({
  x: 0,
  y: 0,
})
const watchMousePositionX = ref(0)
const watchMousePositionY = ref(0)
let stopWatch = () => { }

function watchBasic() {
  watch(search, async (newVal, oldVal) => {
    console.log('search', newVal, oldVal)
    isLoading.value = true
    searchResult.value = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { product: 'apple' },
          { product: 'banana' },
          { product: 'orange' },
        ])
      }, 1000)
    })
    isLoading.value = false
  })

  // 单个 ref
  watch(x, newX => {
    watchSingleX.value = newX + 'px'
    console.log(`x is ${newX}`)
  })

  // getter 函数
  watch(
    () => x.value + y.value,
    sum => {
      watchGetter.value = sum
      console.log(`sum of x + y is: ${sum}`)
    },
  )

  watchEffect(() => {
    console.log(`sum of x + y is: ${x.value + y.value}`)
  })

  // 多个来源组成的数组
  watch([x, () => y.value], ([newX, newY]) => {
    watchMultiple.value = newX + newY
    console.log(`x is ${newX} and y is ${newY}`)
  })



  // 不能直接侦听响应式对象的属性值 ❌
  watch(mousePosition.x, newVal => {
    /*错误，因为 watch() 得到的参数是一个 number  
    此时会有错误警告： Invalid watch source:  0 A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types. 
    */
    watchMousePositionX.value = newVal + 'px'
  })

  /* 提供一个 getter 函数  ✅ */
  watch(
    () => mousePosition.y,
    y => {
      watchMousePositionY.value = y
    },
  )
}

// watchBasic()

function deepWatch() {
  /* 
  当直接监听一个 reactive 对象时，默认会启用深度监听（即使不设置 { deep: true }）。因此，无论是否显式添加 deep: true，以下行为是相同的：
  触发条件：当 mousePosition 的任意嵌套属性（如 x 或 y）变化时，两个 watch 回调都会触发。
  newVal 和 oldVal 的值：它们的引用始终指向同一个 reactive 对象。由于对象是响应式的 Proxy，其引用不变，只是内部属性发生了变化。因此，newVal === oldVal 永远为 true，且它们的属性值已更新为最新值。
  */
  watch(mousePosition, (newVal, oldVal) => {
    /* 嵌套的属性变更时触发，但是这里的 newVal 和 oldVal 是相等的*/
    console.log('deep watch', newVal === oldVal)
    console.log('newVal', newVal, newVal.x, newVal.y)
    console.log('oldVal', oldVal, oldVal.x, oldVal.y)
  })

  watch(mousePosition, (newVal, oldVal) => {
    /* 嵌套的属性变更时触发，但是这里的 newVal 和 oldVal 是相等的*/
    console.log('deep watch', newVal === oldVal)
    console.log('newVal', newVal, newVal.x, newVal.y)
    console.log('oldVal', oldVal, oldVal.x, oldVal.y)
  }, { deep: true })

  /* 
  如果需要获取具体属性的旧值，可以通过监听 getter 函数并记录快照
  */
  watch(
    () => ({ x: mousePosition.x + 'px', y: mousePosition.y + 'px' }),
    (newVal, oldVal) => {
      console.log('deep watch 通过 getter 监听 reactive 对象属性变化')
      console.log('旧值:', oldVal);
      console.log('新值:', newVal);
    },
  );

  watch(
    () => ({ positionX: mousePosition.x + 'px' }),
    (newVal, oldVal) => {
      console.log('deep watch 通过 getter 监听 reactive 对象单个属性变化')
      console.log('旧值:', oldVal);
      console.log('新值:', newVal);
    }
  );
}
// deepWatch()

function watchEffectExample() {
  const watchX = () => {
    watch(() => mousePosition.x, async () => {
      console.log('watch - 点击了鼠标 x 坐标改变')
      const res = await new Promise(resolve => {
        setTimeout(() => {
          if (mousePosition.x < window.innerWidth / 2) {
            resolve('watch - 点击了左半屏')
          } else {
            resolve('watch - 点击了右半屏')
          }
        }, 300)
      })
      console.log(res)
    })
  }
  // watchX()


  const watchEffect1 = () => {
    watchEffect((onCleanup) => {
      /* 初始化时会立即执行一次 */
      /* 如果注释这一行，会导致监听的值发生改变时， 不触发 watch 回调 和 onCleanup 执行 
      这是因为 watchEffect 依赖收集时机只会在回调函数的同步执行部分收集依赖，而不会追踪在异步回调中访问的响应式数据
      （根据vue3官网中的tips提示：
      watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
      ）
      对于处理一步回调内部依赖的的方法：
      1.使用 watch 代替 watchEffect，明确监听对象
      2.创建一个手动调用异步函数，在函数内部访问响应式数据，然后在 watchEffect 回调中调用该函数
      */
      console.log(`开始监听 x=${mousePosition.x}`)
      const timer = setTimeout(() => {
        console.log('watchEffect - 定时器持续运行...', mousePosition.x, Date.now())
        if (mousePosition.x < window.innerWidth / 2) {
          console.log('watchEffect - 点击了左半屏', Date.now())
        } else {
          console.log('watchEffect - 点击了右半屏', Date.now())
        }
      }, 1000)
      onCleanup(() => {
        console.log(`🛑 清理 x=${mousePosition.x} 的定时器 onCleanup`)
        clearTimeout(timer)
      })
    })
  }

  watchEffect1()


  const watchEffect2 = () => {
    stopWatch = watchEffect((onCleanup) => {
      function timeout(args, cb, time = 1000) {
        return setTimeout(() => {
          cb(args)
        }, time)
      }

      const timer = timeout({ x: mousePosition.x, y: mousePosition.y }, (args) => {
        if (args.x < window.innerWidth / 2) {
          console.log('watchEffect - 点击了左半屏', Date.now())
        } else {
          console.log('watchEffect - 点击了右半屏', Date.now())
        }
      })

      onCleanup(() => {
        console.log(`🛑 清理 x=${mousePosition.x} 的定时器 onCleanup`)
        clearTimeout(timer)
      })
    })
  }
  // watchEffect2()
}
watchEffectExample()




function initListener() {
  function handleMouseEvent(e) {
    if (e.button === 0) {
      x.value = e.clientX
      mousePosition.x = e.clientX
    } else if (e.button === 2) {
      y.value = e.clientY
      mousePosition.y = e.clientY
    }
  }

  // 阻止默认的上下文菜单
  function preventContextMenu(e) {
    e.preventDefault()
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleMouseEvent)
    document.addEventListener('contextmenu', preventContextMenu)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleMouseEvent)
    document.removeEventListener('contextmenu', preventContextMenu)
  })
}
initListener()


</script>
