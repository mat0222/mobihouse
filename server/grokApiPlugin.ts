import type { Connect } from 'vite'
import type { Plugin } from 'vite'
import { handleGrokChat, type GrokChatRequest } from './grokChat.ts'

const MAX_BODY_BYTES = 50_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 12

type RateEntry = { count: number; resetAt: number }

const rateLimitByIp = new Map<string, RateEntry>()

function getClientIp(req: Connect.IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return req.socket.remoteAddress || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const current = rateLimitByIp.get(ip)

  if (!current || current.resetAt <= now) {
    rateLimitByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false
  }

  current.count += 1
  rateLimitByIp.set(ip, current)
  return true
}

function readJsonBody(req: Connect.IncomingMessage): Promise<GrokChatRequest> {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0

    req.on('data', (chunk: Buffer | string) => {
      const piece = typeof chunk === 'string' ? chunk : chunk.toString('utf8')
      size += Buffer.byteLength(piece)
      if (size > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'))
        req.destroy()
        return
      }
      body += piece
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

async function verifyFirebaseIdToken(
  idToken: string,
  firebaseApiKey: string,
): Promise<boolean> {
  if (!idToken || !firebaseApiKey) return false

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    )

    if (!response.ok) return false
    const data = (await response.json()) as { users?: unknown[] }
    return Array.isArray(data.users) && data.users.length > 0
  } catch {
    return false
  }
}

function createMiddleware(
  apiKey: string,
  model: string,
  firebaseApiKey: string,
): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.url !== '/api/grok/chat' || req.method !== 'POST') {
      next()
      return
    }

    const ip = getClientIp(req)
    if (!checkRateLimit(ip)) {
      res.statusCode = 429
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Demasiadas solicitudes. Probá de nuevo en un minuto.' }))
      return
    }

    const authHeader = req.headers.authorization
    const idToken =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : ''

    void (async () => {
      try {
        const validToken = await verifyFirebaseIdToken(idToken, firebaseApiKey)
        if (!validToken) {
          res.statusCode = 401
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'No autorizado. Iniciá sesión nuevamente.' }))
          return
        }

        const payload = await readJsonBody(req)
        const result = await handleGrokChat(payload, apiKey, model)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(result))
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'

        if (message === 'MISSING_API_KEY') {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'El asistente no está disponible en este momento.' }))
          return
        }

        if (
          message === 'INVALID_JSON' ||
          message === 'EMPTY_MESSAGES' ||
          message === 'TOO_MANY_MESSAGES' ||
          message === 'INVALID_ROLE' ||
          message === 'PAYLOAD_TOO_LARGE'
        ) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Solicitud inválida.' }))
          return
        }

        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error: 'No pudimos obtener respuesta del asistente. Intentá de nuevo.',
          }),
        )
      }
    })()
  }
}

export function grokApiPlugin(
  apiKey: string,
  model: string,
  firebaseApiKey: string,
): Plugin {
  const middleware = createMiddleware(apiKey, model, firebaseApiKey)

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
