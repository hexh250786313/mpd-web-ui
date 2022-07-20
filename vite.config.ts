import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig((env) => ({
  plugins: [
    env.mode === 'development' &&
      react({
        babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
      }),
    tsConfigPath(),
    splitVendorChunkPlugin(),
  ],
  base: './',
  build: { reportCompressedSize: false, outDir: 'build' },
  esbuild: { jsxInject: "import React from 'react'" },
}))
