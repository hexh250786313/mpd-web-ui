import type { ConfigEnv } from 'vite'

import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
// import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
// import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import tsConfigPath from 'vite-tsconfig-paths'
import { readFileSync } from 'fs'

function transCssUrl(env: ConfigEnv) {
  const fileRegex = /.*src.*\.scss(^|\?used)/g
  const urlRegex = /background.*url\(.+\)/g

  return {
    name: 'transform-css-url',
    load(id: string) {
      if (env.mode === 'production') {
        fileRegex.lastIndex = 0
        urlRegex.lastIndex = 0
        if (fileRegex.test(id)) {
          let src = readFileSync(id.replace(/\?used$/g, ''), 'utf8')
          if (urlRegex.test(src)) {
            const reg = /(?<=(url\(('|")?))\/assets\//g
            src = src.replace(reg, '../')
          }
          return {
            code: src,
            map: null,
          }
        }
      }
    },
  }
}

export default defineConfig((env) => ({
  plugins: [
    env.mode === 'development' &&
      react({
        // babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
      }),
    tsConfigPath(),
    splitVendorChunkPlugin(),
    transCssUrl(env),
  ],
  base: './',
  build: {
    reportCompressedSize: false,
    outDir: 'build',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',

        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/imgs/[name]-[hash][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name].[ext]'
        },
      },
    },
  },
  esbuild: { jsxInject: "import React from 'react'" },
  // css: {
  // preprocessorOptions: {
  // scss: {
  // additionalData:
  // '@use "sass:math"; @import "src/styles/variables.scss";',
  // },
  // },
  // },
}))
