import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, StatusBadge, formatDate } from '../../admin/components/ui'
import { useProperties } from '../../contexts/PropertiesContext'

const tabs = ['general', 'multimedia', 'comercial', 'documentos', 'historial'] as const

export function AdminPropertyDetailPage() {
  const { id } = useParams()
  const { properties } = useProperties()
  const { propertyMeta } = useAdminData()
  const [tab, setTab] = useState<(typeof tabs)[number]>('general')
  const property = properties.find((p) => p.id === id)
  const meta = id ? propertyMeta[id] : undefined

  if (!property) return <Navigate to="/admin/propiedades" replace />

  return (
    <div>
      <PageHeader
        title={property.title}
        subtitle={`${meta?.code ?? property.id} · ${meta?.neighborhood ?? '—'}, ${meta?.city ?? '—'}`}
        actions={
          <div className="flex gap-2">
            <Link
              to="/admin/propiedades"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
            >
              Volver
            </Link>
            <Link
              to={`/propiedades/${property.id}`}
              className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Ver en sitio
            </Link>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={meta?.status ?? 'disponible'} />
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-700">
          {meta?.operation ?? 'venta'}
        </span>
        <span className="text-sm font-bold text-slate-900">{property.price}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium capitalize ${
              tab === t
                ? 'border-b-2 border-cyan-600 text-cyan-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        {tab === 'general' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título" value={property.title} />
            <Field label="Tipo" value={property.type} />
            <Field label="Habitaciones" value={String(property.bedrooms)} />
            <Field label="Baños" value={String(property.bathrooms)} />
            <Field label="Superficie" value={`${property.area} m²`} />
            <Field label="Cochera" value={String(property.garages)} />
            <Field label="Antigüedad" value={meta ? `${meta.yearBuilt}` : '—'} />
            <Field label="Propietario" value={meta?.ownerName ?? '—'} />
            <Field label="Agente" value={meta?.agentName ?? property.agent.name} />
            <Field
              label="Publicación"
              value={meta ? formatDate(meta.publishedAt) : '—'}
            />
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-slate-500">Descripción</p>
              <p className="mt-1 text-sm text-slate-700">{property.description}</p>
            </div>
          </div>
        )}

        {tab === 'multimedia' && (
          <div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {(property.images.length ? property.images : [property.image]).map((src) => (
                <img key={src} src={src} alt="" className="h-36 w-full rounded-lg object-cover" />
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-lg border border-dashed border-slate-200 p-4">Video tour — pendiente</div>
              <div className="rounded-lg border border-dashed border-slate-200 p-4">Plano — ver Documentos</div>
              <div className="rounded-lg border border-dashed border-slate-200 p-4">Tour virtual — demo</div>
            </div>
          </div>
        )}

        {tab === 'comercial' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio" value={property.price} />
            <Field label="Expensas" value={meta?.expenses ?? '—'} />
            <Field label="Impuestos" value={meta?.taxes ?? '—'} />
            <Field label="Comisión" value={meta?.commission ?? '—'} />
            <Field label="Rentabilidad estimada" value={meta?.profitability ?? '—'} />
          </div>
        )}

        {tab === 'documentos' && (
          <ul className="space-y-2">
            {(meta?.docs ?? [{ name: 'Sin documentos', type: '—' }]).map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span>
                  {d.type} — {d.name}
                </span>
                <button type="button" className="text-cyan-700 hover:underline">
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        )}

        {tab === 'historial' && (
          <ul className="space-y-3">
            {(meta?.history ?? []).map((h, i) => (
              <li key={`${h.date}-${i}`} className="flex gap-3 text-sm">
                <span className="w-14 shrink-0 font-mono text-xs text-slate-400">{h.date}</span>
                <span className="text-slate-700">{h.text}</span>
              </li>
            ))}
            {!meta?.history?.length && (
              <p className="text-sm text-slate-500">Sin historial registrado.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
