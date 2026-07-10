export interface ChatMessagePayload {
  role: 'user' | 'assistant'
  content: string
}

export interface PropertySummaryPayload {
  title: string
  price: string
  badge: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
}

interface GrokChatRequest {
  messages: ChatMessagePayload[]
  userName?: string
  properties?: PropertySummaryPayload[]
}

export async function sendGrokMessage(request: GrokChatRequest): Promise<string> {
  const response = await fetch('/api/grok/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  const data = (await response.json()) as { reply?: string; error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo conectar con el asistente.')
  }

  if (!data.reply) {
    throw new Error('El asistente no devolvió una respuesta.')
  }

  return data.reply
}
