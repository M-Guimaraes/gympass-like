import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    coverage: {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
});
