import { createRouter, createWebHistory } from 'vue-router'

// 自动导入所有视图组件
const modules = import.meta.glob('../views/**/*.vue')

// 自动生成路由配置
const routes = Object.keys(modules).map(path => {
  // 将文件路径转换为路由路径，优先匹配直接命名的vue文件
  const routePath = path
    .replace('../views', '')
    .replace(/(\/index)?\.vue$/i, '') // 同时处理 index.vue 和普通.vue文件
    .toLowerCase()

  // 处理首页路由
  if (routePath.includes('homeview')) {
    return {
      path: '/',
      component: modules[path],
    }
  }

  return {
    path: routePath,
    component: modules[path],
  }
})

// 新增：去重路由并保持优先级（直接命名的vue文件优先）
const uniqueRoutes = routes.reduce((acc, curr) => {
  const existing = acc.find(r => r.path === curr.path)
  if (!existing) acc.push(curr)
  return acc
}, [])

const router = createRouter({
  history: createWebHistory(),
  routes: uniqueRoutes, // 使用去重后的路由配置
})

export default router
