import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { grokApiPlugin } from './server/grokApiPlugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // GitHub Pages sirve el sitio en /mobihouse/
  const base = command === 'build' ? '/mobihouse/' : '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      // El proxy de Grok solo existe en `npm run dev` (Pages no tiene backend).
      ...(command === 'serve'
        ? [
            grokApiPlugin(
              env.XAI_API_KEY ?? '',
              env.XAI_MODEL || 'grok-3-mini-fast',
              env.VITE_FIREBASE_API_KEY ?? '',
            ),
          ]
        : []),
    ],
    optimizeDeps: {
      include: ['leaflet', 'react-leaflet'],
    },
  }
})
