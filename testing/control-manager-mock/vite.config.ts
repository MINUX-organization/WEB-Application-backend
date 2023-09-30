import dotenv from 'dotenv'
dotenv.config()

function assertEnv(key: string) {
  if (process.env[key] === undefined) {
    throw new Error(`${key} is undefined`)
  }
}
assertEnv('PORT')

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number.parseInt(process.env.PORT!),
    host: true
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
