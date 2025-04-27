import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: { overlay: false },
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    exclude: ['mysql2']
  },
  build: {
    rollupOptions: {
      external: ['mysql2', 'mysql2/promise']
    }
  }
});