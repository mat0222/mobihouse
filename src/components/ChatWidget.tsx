import { useState, useRef, useEffect, type FormEvent } from 'react'
import { HiOutlineXMark, HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2'
import { MobihouseLogo } from './MobihouseLogo'
import { useAuth } from '../contexts/AuthContext'
import { useProperties } from '../contexts/PropertiesContext'
import { sendGrokMessage } from '../services/grokChat'

interface Message {
  id: number
  role: 'assistant' | 'user'
  text: string
}

const assistantAvatar =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face'

export function ChatWidget() {
  const { user, getIdToken } = useAuth()
  const { properties } = useProperties()
  const firstName = user?.name.split(' ')[0] ?? 'Usuario'

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: `¡Hola ${firstName}! Soy el asistente de MobiHouse. ¿En qué puedo ayudarte hoy?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isLoading])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { id: Date.now(), role: 'user', text }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      const history = nextMessages
        .filter((message) => message.id !== 1)
        .map((message) => ({
          role: message.role,
          content: message.text,
        }))

      const token = await getIdToken()
      if (!token) {
        throw new Error('Sesión inválida. Volvé a iniciar sesión.')
      }

      const reply = await sendGrokMessage(
        {
          messages: history,
          userName: user?.name ?? firstName,
          properties: properties.map((property) => ({
            title: property.title,
            price: property.price,
            badge: property.badge,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            type: property.type,
          })),
        },
        token,
      )

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: reply,
        },
      ])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Ocurrió un error al consultar con Grok.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar asistente"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] lg:bg-transparent lg:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            role="dialog"
            aria-label="Asistente MobiHouse"
            className="pointer-events-auto flex h-[min(520px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] animate-chat-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center gap-2 bg-cyan-500 px-4 py-3.5 text-white">
              <MobihouseLogo className="h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Asistente MobiHouse (IA)</p>
                <p className="text-[11px] text-cyan-100">
                  {isLoading ? 'Grok está pensando...' : 'En línea · Powered by Grok'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-animated shrink-0 rounded-full p-1.5 text-white/90 hover:bg-white/20"
                aria-label="Cerrar chat"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message) =>
                message.role === 'assistant' ? (
                  <div key={message.id} className="flex items-start gap-2.5">
                    <img
                      src={assistantAvatar}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white"
                    />
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#1a2332] px-3.5 py-2.5 text-sm leading-relaxed text-white">
                      {message.text}
                    </div>
                  </div>
                ),
              )}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <img
                    src={assistantAvatar}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-slate-500 shadow-sm">
                    Escribiendo...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-slate-200 bg-white p-3"
            >
              {error && (
                <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Escribí tu consulta..."
                  disabled={isLoading}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="btn-animated shrink-0 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className={`btn-animated pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900'
              : 'bg-cyan-500 hover:bg-cyan-600 hover:shadow-cyan-500/40 btn-pulse'
          }`}
          aria-label={isOpen ? 'Cerrar asistente IA' : 'Abrir asistente IA'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <HiOutlineXMark className="h-6 w-6" />
          ) : (
            <HiOutlineChatBubbleOvalLeft className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  )
}
