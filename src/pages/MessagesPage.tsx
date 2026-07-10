import { useState } from 'react'
import { HiOutlinePaperAirplane } from 'react-icons/hi2'
import { conversations as initialConversations, type Conversation } from '../data/messages'

export function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? null)
  const [draft, setDraft] = useState('')

  const active = conversations.find((c) => c.id === activeId)

  const sendMessage = () => {
    const text = draft.trim()
    if (!text || !active) return

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? {
              ...conv,
              lastMessage: text,
              lastTimestamp: 'Ahora',
              messages: [
                ...conv.messages,
                {
                  id: Date.now(),
                  senderId: 'me',
                  text,
                  timestamp: new Date().toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  read: true,
                },
              ],
            }
          : conv,
      ),
    )
    setDraft('')
  }

  const markAsRead = (conv: Conversation) => {
    if (conv.unread === 0) return
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)),
    )
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col p-6">
      <h1 className="mb-5 text-2xl font-bold text-slate-900">Mensajes</h1>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl bg-white shadow-sm">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-slate-100">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => {
                setActiveId(conv.id)
                markAsRead(conv)
              }}
              className={`btn-animated flex w-full gap-3 border-b border-slate-50 p-4 text-left hover:bg-slate-50 ${
                activeId === conv.id ? 'bg-cyan-50' : ''
              }`}
            >
              <img
                src={conv.contactAvatar}
                alt={conv.contactName}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {conv.contactName}
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">
                    {conv.lastTimestamp}
                  </span>
                </div>
                {conv.propertyTitle && (
                  <p className="truncate text-xs text-cyan-600">{conv.propertyTitle}</p>
                )}
                <p className="truncate text-sm text-slate-500">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-bold text-white">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </aside>

        {active ? (
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <img
                src={active.contactAvatar}
                alt={active.contactName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-900">{active.contactName}</p>
                {active.propertyTitle && (
                  <p className="text-xs text-slate-500">{active.propertyTitle}</p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {active.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.senderId === 'me'
                        ? 'rounded-tr-sm bg-[#1a2332] text-white'
                        : 'rounded-tl-sm bg-slate-100 text-slate-700'
                    }`}
                  >
                    {msg.text}
                    <p
                      className={`mt-1 text-[10px] ${
                        msg.senderId === 'me' ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escribí un mensaje..."
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="submit"
                  className="btn-animated flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
                  aria-label="Enviar mensaje"
                >
                  <HiOutlinePaperAirplane className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            Seleccioná una conversación
          </div>
        )}
      </div>
    </div>
  )
}
