import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false, // Forces CSS into one file for better loading
    minify: true,
  },
  css: {
    devSourcemap: true, // Helps with debugging
  }
})