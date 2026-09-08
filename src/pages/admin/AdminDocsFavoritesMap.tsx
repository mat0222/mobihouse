import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, formatDate } from '../../admin/components/ui'
import { useFavorites } from '../../contexts/FavoritesContext'
import { useProperties } from '../../contexts/PropertiesContext'
import { PropertyMapView } from '../../components/PropertyMapView'
import type { DocumentCategory } from '../../admin/types'

export function AdminDocumentsPage() {
  const { documents } = useAdminData()
  const [category, setCategory] = useState<string>('all')
  const rows = documents.filter((d) => category === 'all' || d.category === category)

  return (
    <div>
      <PageHeader title="Documentos" subtitle="Biblioteca central de archivos" />
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">Todas las categorías</option>
          {(
            ['contratos', 'escrituras', 'planos', 'clientes', 'propiedades', 'comprobantes'] as DocumentCategory[]
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <ul>
          {rows.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 px-4 py-3 text-sm last:border-0"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {d.type} — {d.name}
                </p>
                <p className="text-xs text-slate-500">
                  {d.category} · {d.relatedLabel} · {d.size} · {formatDate(d.uploadedAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs">Previsualizar</button>
                <button type="button" className="rounded bg-cyan-50 px-2 py-1 text-xs text-cyan-800">Descargar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function AdminFavoritesInsightsPage() {
  const { publications } = useAdminData()
  const { favorites } = useFavorites()
  const { properties } = useProperties()
  const ranked = [...publications].sort((a, b) => b.favorites - a.favorites)
  const favoriteProps = properties.filter((p) => favorites.includes(p.id))

  return (
    <div>
      <PageHeader title="Favoritos" subtitle="Interés de usuarios y rankings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Más guardadas (publicaciones)</h2>
          <ul className="space-y-2 text-sm">
            {ranked.map((p) => (
              <li key={p.id} className="flex justify-between border-b border-slate-50 pb-2">
                <span>{p.propertyTitle}</span>
                <span className="font-semibold text-rose-600">{p.favorites}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Favoritos de esta sesión admin</h2>
          {favoriteProps.length === 0 ? (
            <p className="text-sm text-slate-500">Todavía no hay favoritos en este navegador.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {favoriteProps.map((p) => (
                <li key={p.id}>
                  <Link to={`/admin/propiedades/${p.id}`} className="text-cyan-700 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export function AdminMapPage() {
  const { properties } = useProperties()
  const { propertyMeta } = useAdminData()
  const [operation, setOperation] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        const meta = propertyMeta[p.id]
        const op = meta?.operation ?? (p.badge === 'EN ALQUILER' ? 'alquiler' : 'venta')
        const st = meta?.status ?? 'disponible'
        return (operation === 'all' || op === operation) && (status === 'all' || st === status)
      }),
    [properties, propertyMeta, operation, status],
  )

  return (
    <div>
      <PageHeader title="Mapa de propiedades" subtitle="Inventario geolocalizado" />
      <div className="mb-3 flex flex-wrap gap-2">
        <select value={operation} onChange={(e) => setOperation(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Todas las operaciones</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="reservada">Reservada</option>
          <option value="alquilada">Alquilada</option>
          <option value="vendida">Vendida</option>
        </select>
      </div>
      <div className="h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <PropertyMapView properties={filtered} zoom={12} active />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const meta = propertyMeta[p.id]
          return (
            <Link
              key={p.id}
              to={`/admin/propiedades/${p.id}`}
              className="rounded-lg border border-slate-100 bg-white p-3 text-sm shadow-sm hover:border-cyan-200"
            >
              <p className="font-semibold text-slate-900">{p.title}</p>
              <p className="text-cyan-700">{p.price}</p>
              <p className="text-xs text-slate-500">
                {meta?.neighborhood ?? '—'} · {p.type}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
