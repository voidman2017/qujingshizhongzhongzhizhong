// @ts-check
/// <reference types="node" />
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import alias from '@rollup/plugin-alias'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 读取 package.json
const pkg = require('./package.json')

// 构建配置
const outputConfigs = {
  'esm-bundler': {
    file: `dist/${pkg.name}.esm-bundler.js`,
    format: 'es'
  },
  'esm-browser': {
    file: `dist/${pkg.name}.esm-browser.js`,
    format: 'es'
  },
  cjs: {
    file: `dist/${pkg.name}.cjs.js`,
    format: 'cjs'
  },
  global: {
    file: `dist/${pkg.name}.global.js`,
    format: 'iife',
    name: 'TypeScriptLearning'
  }
}

const defaultFormats = ['esm-bundler', 'cjs', 'global']
const inlineFormats = ['esm-browser', 'esm-bundler', 'cjs']
const packageFormats = defaultFormats
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

/**
 * @param {string} format
 * @param {any} output
 * @param {any[]} plugins
 */
function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(`invalid format: "${format}"`)
    // @ts-ignore
    process.exit(1)
  }

  // @ts-ignore
  const isProductionBuild = process.env.NODE_ENV === 'production'
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isBrowserESMBuild = /esm-browser/.test(format)
  const isNodeBuild = format === 'cjs'
  const isGlobalBuild = /global/.test(format)
  const isBrowserBuild = (isBrowserESMBuild || isGlobalBuild) && !isNodeBuild

  if (isGlobalBuild) {
    output.name = output.name || 'TypeScriptLearning'
  }

  const shouldEmitDeclarations = !isGlobalBuild

  const tsPlugin = esbuild({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    sourceMap: output.sourcemap,
    minify: false,
    target: isNodeBuild ? 'node14' : 'es2015',
    define: {
      __VERSION__: `"${pkg.version}"`,
      __DEV__: JSON.stringify(!isProductionBuild),
    },
  })

  const external = isGlobalBuild || isBrowserESMBuild ? [] : ['typescript']

  const nodePlugins = isNodeBuild
    ? []
    : [
        polyfillNode(),
        nodeResolve({
          preferBuiltins: false,
          browser: isBrowserBuild
        }),
        commonjs()
      ]

  return {
    input: 'src/index.ts',
    external,
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      alias({
        entries: [
          { find: /^node:(.+)$/, replacement: '$1' }
        ]
      }),
      replace({
        preventAssignment: true,
        __VERSION__: `"${pkg.version}"`,
        __DEV__: isBundlerESMBuild
          ? `(process.env.NODE_ENV !== 'production')`
          : JSON.stringify(!isProductionBuild),
        __BROWSER__: JSON.stringify(isBrowserBuild),
        __GLOBAL__: JSON.stringify(isGlobalBuild),
        __ESM_BUNDLER__: JSON.stringify(isBundlerESMBuild),
        __ESM_BROWSER__: JSON.stringify(isBrowserESMBuild),
        __NODE_JS__: JSON.stringify(isNodeBuild),
        __CJS__: JSON.stringify(format === 'cjs')
      }),
      ...nodePlugins,
      ...plugins
    ],
    output: {
      ...output,
      file: format === 'cjs' ? output.file.replace('.cjs.js', '.cjs') : output.file,
      exports: format === 'cjs' ? 'auto' : 'auto',
      sourcemap: true,
      banner: `/**\n* ${pkg.name} v${pkg.version}\n* (c) 2025 princed\n* @license MIT\n*/`
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}