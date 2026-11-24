import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { staticPages } from './scripts/static-pages'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), staticPages()],
    define: {
      'import.meta.env.VITE_VERCEL_ANALYTICS': JSON.stringify(env.VITE_VERCEL_ANALYTICS ?? (process.env.VERCEL === '1' ? 'true' : 'false')),
    },
  }
})
