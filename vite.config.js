import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,
    strictPort: false,
    allowedHosts: ['.bohrium.tech', 'localhost'] // 允许 bohrium.tech 的所有子域名
  },
  preview: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 4173,
    strictPort: false,
    allowedHosts: ['.bohrium.tech', 'localhost'] // 允许 bohrium.tech 的所有子域名
  }
})

