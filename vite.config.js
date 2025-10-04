import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Three-Template/', // Set base path for GitHub Pages
  plugins: [react()],
  assetsInclude: ['**/*.fbx'],
  resolve: {
    alias: {
            '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
  }
})