import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environment: 'node',
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: 20000,
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  optimizeDeps: {
    exclude: ['express'],
  },
  ssr: {
    external: ['express'],
  },
})
