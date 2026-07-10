import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { grokApiPlugin } from './server/grokApiPlugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      grokApiPlugin(env.XAI_API_KEY ?? '', env.XAI_MODEL || 'grok-3-mini-fast'),
    ],
    optimizeDeps: {
      include: ['leaflet', 'react-leaflet'],
    },
  }
})
