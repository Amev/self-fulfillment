import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  ...(process.env.NODE_ENV === 'development'
    ? {
        define: {
          global: {},
        },
      }
    : {}),
  resolve: {
    alias: {
      ...(process.env.NODE_ENV !== 'development'
        ? {
            './runtimeConfig': './runtimeConfig.browser', // fix production build
          }
        : {}),
    },
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3004,
    host: true,
  },
});
