import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
    env: {
      VITE_API_URL: '/api',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/hooks/**', 'src/api/**', 'src/components/**'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/test/**'],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 60,
        statements: 80,
      },
    },
  },
});
