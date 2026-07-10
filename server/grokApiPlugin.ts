import type { Connect } from 'vite'
import type { Plugin } from 'vite'
import { handleGrokChat, type GrokChatRequest } from './grokChat.ts'

function readJsonBody(req: Connect.IncomingMessage): Promise<GrokChatRequest> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as GrokChatRequest)
      } catch {
        reject(new Error('INVALID_JSON'))
      }
    })

    req.on('error', reject)
  })
}

function createMiddleware(apiKey: string, model: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.url !== '/api/grok/chat' || req.method !== 'POST') {
      next()
      return
    }

    readJsonBody(req)
      .then(async (payload) => {
        const result = await handleGrokChat(payload, apiKey, model)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'

        if (message === 'MISSING_API_KEY') {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                'La API de Grok no está configurada. Agregá XAI_API_KEY en tu archivo .env.',
            }),
          )
          return
        }

        if (message === 'INVALID_JSON' || message === 'EMPTY_MESSAGES') {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Solicitud inválida.' }))
          return
        }

        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error: 'No pudimos obtener respuesta de Grok. Intentá de nuevo en unos segundos.',
          }),
        )
      })
  }
}

export function grokApiPlugin(apiKey: string, model: string): Plugin {
  const middleware = createMiddleware(apiKey, model)

  return {
    name: 'grok-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
