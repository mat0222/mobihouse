import { useMemo, useState } from 'react'
import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, StatusBadge, formatDateTime } from '../../admin/components/ui'

type ViewMode = 'day' | 'week' | 'month'

export function AdminAgendaPage() {
  const { visits, updateVisitStatus, appendActivity } = useAdminData()
  const [view, setView] = useState<ViewMode>('week')
  const sorted = useMemo(
    () => [...visits].sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime)),
    [visits],
  )

  return (
    <div>
      <PageHeader
        title="Agenda / Visitas"
        subtitle="Calendario comercial de visitas"
        actions={
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${
                  view === v ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Visita mañana a las 10:30 — Juan Pérez aún no confirmó la visita.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((v) => (
          <article key={v.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {new Date(v.datetime).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(v.datetime)}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{v.propertyTitle}</h3>
            <p className="text-sm text-slate-600">{v.propertyLocation}</p>
            <p className="mt-2 text-sm text-slate-700">Cliente: {v.clientName}</p>
            <p className="text-sm text-slate-700">Agente: {v.agentName}</p>
            {v.notes && <p className="mt-2 text-xs text-slate-500">{v.notes}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              <button
                type="button"
                className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800"
                onClick={() => {
                  updateVisitStatus(v.id, 'confirmada', true)
                  appendActivity(`Visita confirmada — ${v.clientName}`, 'visita')
                }}
              >
                Confirmar
              </button>
              <button
                type="button"
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium"
                onClick={() => updateVisitStatus(v.id, 'realizada', true)}
              >
                Realizada
              </button>
              <button
                type="button"
                className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800"
                onClick={() => updateVisitStatus(v.id, 'reprogramada')}
              >
                Reprogramar
              </button>
              <button
                type="button"
                className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                onClick={() => updateVisitStatus(v.id, 'cancelada')}
              >
                Cancelar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
