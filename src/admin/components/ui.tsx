import type { ReactNode } from 'react'
import type { PropertyStatus } from '../types'
import { PROPERTY_STATUS_LABELS } from '../types'

const propertyStatusClass: Record<PropertyStatus, string> = {
  disponible: 'bg-emerald-100 text-emerald-800',
  reservada: 'bg-amber-100 text-amber-800',
  alquilada: 'bg-sky-100 text-sky-800',
  vendida: 'bg-violet-100 text-violet-800',
  inactiva: 'bg-slate-200 text-slate-700',
  suspendida: 'bg-red-100 text-red-800',
}

const genericClass: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-800',
  contactado: 'bg-cyan-100 text-cyan-800',
  visitando: 'bg-indigo-100 text-indigo-800',
  interesado: 'bg-orange-100 text-orange-800',
  negociando: 'bg-amber-100 text-amber-900',
  cerrado: 'bg-emerald-100 text-emerald-800',
  perdido: 'bg-red-100 text-red-800',
  activa: 'bg-emerald-100 text-emerald-800',
  activo: 'bg-emerald-100 text-emerald-800',
  proximo_vencer: 'bg-amber-100 text-amber-800',
  vencido: 'bg-red-100 text-red-800',
  finalizado: 'bg-slate-200 text-slate-700',
  pagado: 'bg-emerald-100 text-emerald-800',
  pendiente: 'bg-amber-100 text-amber-800',
  parcial: 'bg-orange-100 text-orange-800',
  publicada: 'bg-emerald-100 text-emerald-800',
  pausada: 'bg-slate-200 text-slate-700',
  borrador: 'bg-slate-100 text-slate-600',
  pendiente_firma: 'bg-amber-100 text-amber-800',
  cancelado: 'bg-slate-200 text-slate-700',
  cancelada: 'bg-slate-200 text-slate-700',
  nueva: 'bg-blue-100 text-blue-800',
  en_conversacion: 'bg-cyan-100 text-cyan-800',
  respondida: 'bg-emerald-100 text-emerald-800',
  cerrada: 'bg-slate-200 text-slate-700',
  programada: 'bg-blue-100 text-blue-800',
  confirmada: 'bg-emerald-100 text-emerald-800',
  realizada: 'bg-slate-200 text-slate-700',
  reprogramada: 'bg-amber-100 text-amber-800',
  en_negociacion: 'bg-amber-100 text-amber-800',
  reserva: 'bg-violet-100 text-violet-800',
  documentacion: 'bg-sky-100 text-sky-800',
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-200 text-slate-700',
}

export function StatusBadge({
  status,
  label,
}: {
  status: string
  label?: string
}) {
  const isProperty = status in propertyStatusClass
  const cls = isProperty
    ? propertyStatusClass[status as PropertyStatus]
    : genericClass[status] ?? 'bg-slate-100 text-slate-700'
  const text =
    label ??
    (isProperty
      ? PROPERTY_STATUS_LABELS[status as PropertyStatus]
      : status.replaceAll('_', ' '))

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {text}
    </span>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function KpiCard({
  label,
  value,
  hint,
  accent = 'cyan',
}: {
  label: string
  value: string | number
  hint?: string
  accent?: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose' | 'sky' | 'slate'
}) {
  const accents = {
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
    rose: 'bg-rose-50 text-rose-700',
    sky: 'bg-sky-50 text-sky-700',
    slate: 'bg-slate-100 text-slate-700',
  }
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && (
        <p className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${accents[accent]}`}>
          {hint}
        </p>
      )}
    </div>
  )
}

export function PeriodFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { key: string; label: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            value === opt.key
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  )
}

export function SimpleBarChart({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number }[]
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{item.label}</span>
              <span className="font-semibold text-slate-800">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-cyan-500"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
