import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['chilly-rules-speak.loca.lt'],
  },
  optimizeDeps: {
    include: ['react-hot-toast'],
    dedupe: ['react', 'react-dom']
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  }
})
