import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },

  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
