import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          optimize: false, // 关闭优化（仅开发环境）
          comments: false, // 禁用注释节点的生成
        },
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    port: 2233,
  },
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
  optimizeDeps: {
    exclude: ['vue', 'lodash-es'],
  },
})
