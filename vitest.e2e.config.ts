import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: 'node',
    include: ['test/**/*.e2e.spec.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});