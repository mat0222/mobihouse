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

  if (!request.messages.length) {
    throw new Error('EMPTY_MESSAGES')
  }

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(
            request.userName ?? 'Usuario',
            request.properties ?? [],
          ),
        },
        ...request.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`GROK_API_ERROR:${response.status}:${errorBody}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const reply = data.choices?.[0]?.message?.content?.trim()

  if (!reply) {
    throw new Error('EMPTY_REPLY')
  }

  return { reply }
}
