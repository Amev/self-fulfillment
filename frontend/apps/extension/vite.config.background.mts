import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/libs/background.ts',
      name: 'background',
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    emptyOutDir: false,
  },
  plugins: [viteTsconfigPaths()],
});
