import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/graphql-proxy':{
        target: 'https://emma.mav.hu/otp2-backend/otp/routers/default/index/graphql',
        changeOrigin: true,
        rewrite: path=>path.replace(/^\/graphql-proxy/, '')
      }
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
