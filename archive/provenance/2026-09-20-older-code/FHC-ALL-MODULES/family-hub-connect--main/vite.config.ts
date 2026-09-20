import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@firebase': path.resolve('src/firebase'),
      '@context': path.resolve('src/context'),
      '@components': path.resolve('src/components'),
      '@utils': path.resolve('src/utils')
    }
  }
});