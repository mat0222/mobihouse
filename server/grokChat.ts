export interface GrokChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PropertySummary {
  title: string
  price: string
  badge: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
}

export interface GrokChatRequest {
  messages: GrokChatMessage[]
  userName?: string
  properties?: PropertySummary[]
}

export interface GrokChatResponse {
  reply: string
}

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000
const MAX_PROPERTIES = 30
const MAX_USER_NAME = 80

function sanitize(value: string, max: number): string {
  return value.replace(/[<>]/g, '').trim().slice(0, max)
}

function validateRequest(request: GrokChatRequest): GrokChatRequest {
  if (!Array.isArray(request.messages) || request.messages.length === 0) {
    throw new Error('EMPTY_MESSAGES')
  }

  if (request.messages.length > MAX_MESSAGES) {
    throw new Error('TOO_MANY_MESSAGES')
  }

  const messages = request.messages.map((message) => {
    if (message.role !== 'user' && message.role !== 'assistant') {
      throw new Error('INVALID_ROLE')
    }
    const content = sanitize(String(message.content ?? ''), MAX_MESSAGE_LENGTH)
    if (!content) {
      throw new Error('EMPTY_MESSAGES')
    }
    return { role: message.role, content }
  })

  const properties = Array.isArray(request.properties)
    ? request.properties.slice(0, MAX_PROPERTIES).map((property) => ({
        title: sanitize(String(property.title ?? ''), 120),
        price: sanitize(String(property.price ?? ''), 40),
        badge: sanitize(String(property.badge ?? ''), 40),
        bedrooms: Number(property.bedrooms) || 0,
        bathrooms: Number(property.bathrooms) || 0,
        area: Number(property.area) || 0,
        type: sanitize(String(property.type ?? ''), 40),
      }))
    : []

  return {
    messages,
    userName: sanitize(String(request.userName ?? 'Usuario'), MAX_USER_NAME) || 'Usuario',
    properties,
  }
}

function buildSystemPrompt(userName: string, properties: PropertySummary[]) {
  const catalog =
    properties.length > 0
      ? properties
          .map(
            (property, index) =>
              `${index + 1}. ${property.title} — ${property.price} (${property.badge}). ${property.type}, ${property.bedrooms} hab., ${property.bathrooms} baños, ${property.area} m².`,
          )
          .join('\n')
      : 'No hay propiedades cargadas en este momento.'

  return `Sos el asistente virtual de MobiHouse, una inmobiliaria online en Argentina.
Respondé siempre en español rioplatense, de forma clara, amable y profesional.
Ayudá al usuario a encontrar propiedades, comparar opciones, entender precios y coordinar visitas.
Si no tenés un dato exacto, decilo con honestidad y ofrecé alternativas útiles.
Mantené respuestas concisas (máximo 3 párrafos cortos).
No inventes datos de contacto, precios ni direcciones que no estén en el catálogo.

Usuario actual: ${userName}

Propiedades disponibles:
${catalog}`
}

export async function handleGrokChat(
  request: GrokChatRequest,
  apiKey: string,
  model: string,
): Promise<GrokChatResponse> {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY')
  }

  const safeRequest = validateRequest(request)

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(
            safeRequest.userName ?? 'Usuario',
            safeRequest.properties ?? [],
          ),
        },
        ...safeRequest.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`GROK_API_ERROR:${response.status}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const reply = data.choices?.[0]?.message?.content?.trim()

  if (!reply) {
    throw new Error('EMPTY_REPLY')
  }

  return { reply: sanitize(reply, 4000) }
}
