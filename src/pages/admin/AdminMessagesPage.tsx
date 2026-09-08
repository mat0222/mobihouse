import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, StatusBadge, formatDateTime } from '../../admin/components/ui'

export function AdminMessagesPage() {
  const { inquiries, updateInquiryStatus } = useAdminData()
  const [selectedId, setSelectedId] = useState(inquiries[0]?.id ?? '')
  const selected = inquiries.find((i) => i.id === selectedId) ?? inquiries[0]

  return (
    <div>
      <PageHeader title="Mensajes / Consultas" subtitle="Bandeja de entrada conectada al CRM" />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {inquiries.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setSelectedId(i.id)}
              className={`block w-full border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50 ${
                selected?.id === i.id ? 'bg-cyan-50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{i.clientName}</p>
                {i.unread && <span className="h-2 w-2 rounded-full bg-cyan-500" />}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">{i.message}</p>
              <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(i.createdAt)}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-slate-500">{selected.propertyTitle}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{selected.clientName}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Agente: {selected.agentName} · {formatDateTime(selected.createdAt)}
            </p>
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-800">{selected.message}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white"
                onClick={() => updateInquiryStatus(selected.id, 'respondida')}
              >
                Responder
              </button>
              <Link
                to={selected.clientId ? `/admin/clientes/${selected.clientId}` : '/admin/clientes'}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
              >
                Crear / ver cliente
              </Link>
              <Link
                to="/admin/agenda"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
              >
                Agendar visita
              </Link>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onClick={() => updateInquiryStatus(selected.id, 'cerrada')}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
