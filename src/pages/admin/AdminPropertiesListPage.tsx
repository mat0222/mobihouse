import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, StatusBadge, formatDate } from '../../admin/components/ui'
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from '../../admin/types'
import { useProperties } from '../../contexts/PropertiesContext'
import { AdminPropertiesPage as PropertyEditor } from './AdminPropertiesEditor'

export function AdminPropertiesListPage() {
  const { properties, loading, error } = useProperties()
  const { propertyMeta, updatePropertyMetaStatus, appendAudit, appendActivity } = useAdminData()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [operation, setOperation] = useState<string>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 8

  const rows = useMemo(() => {
    return properties
      .map((p) => {
        const meta = propertyMeta[p.id]
        return {
          property: p,
          code: meta?.code ?? `P-${p.id.slice(0, 4).toUpperCase()}`,
          status: (meta?.status ?? 'disponible') as PropertyStatus,
          operation: meta?.operation ?? (p.badge === 'EN ALQUILER' ? 'alquiler' : 'venta'),
          city: meta?.city ?? '—',
          neighborhood: meta?.neighborhood ?? '—',
          owner: meta?.ownerName ?? '—',
          agent: meta?.agentName ?? p.agent.name,
          publishedAt: meta?.publishedAt ?? new Date().toISOString(),
          updatedAt: meta?.updatedAt ?? new Date().toISOString(),
        }
      })
      .filter((r) => {
        const q = search.toLowerCase()
        const matchesSearch =
          !q ||
          r.property.title.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.neighborhood.toLowerCase().includes(q)
        const matchesStatus = status === 'all' || r.status === status
        const matchesOp = operation === 'all' || r.operation === operation
        return matchesSearch && matchesStatus && matchesOp
      })
  }, [properties, propertyMeta, search, status, operation])

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize)

  if (showEditor) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowEditor(false)}
          className="mb-4 text-sm font-medium text-cyan-700 hover:underline"
        >
          ← Volver al listado
        </button>
        <PropertyEditor />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Propiedades"
        subtitle="Inventario completo con estados comerciales"
        actions={
          <button
            type="button"
            onClick={() => setShowEditor(true)}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Nueva propiedad
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Buscar código, título, barrio..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(PROPERTY_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">Venta / Alquiler</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Propiedad</th>
              <th className="px-3 py-3">Código</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Operación</th>
              <th className="px-3 py-3">Ubicación</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Agente</th>
              <th className="px-3 py-3">Actualización</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
                  Sin resultados
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr key={r.property.id} className="border-t border-slate-50 hover:bg-slate-50/80">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.property.image}
                        alt=""
                        className="h-12 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{r.property.title}</p>
                        <p className="text-xs text-slate-500">
                          {r.property.bedrooms} amb · {r.property.bathrooms} baños · {r.property.area} m²
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{r.code}</td>
                  <td className="px-3 py-3">{r.property.type}</td>
                  <td className="px-3 py-3 capitalize">{r.operation}</td>
                  <td className="px-3 py-3">
                    {r.neighborhood}, {r.city}
                  </td>
                  <td className="px-3 py-3 font-semibold">{r.property.price}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3">{r.agent}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{formatDate(r.updatedAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Link
                        to={`/admin/propiedades/${r.property.id}`}
                        className="rounded bg-slate-100 px-2 py-1 text-xs font-medium hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowEditor(true)}
                        className="rounded bg-slate-100 px-2 py-1 text-xs font-medium hover:bg-slate-200"
                      >
                        Editar
                      </button>
                      <select
                        className="rounded border border-slate-200 px-1 py-1 text-xs"
                        value={r.status}
                        onChange={(e) => {
                          const next = e.target.value as PropertyStatus
                          updatePropertyMetaStatus(r.property.id, next)
                          appendAudit('Admin', 'cambió estado', `${r.code} → ${next}`)
                          appendActivity(`Estado ${r.code} → ${next}`, 'propiedad')
                        }}
                      >
                        {Object.entries(PROPERTY_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          {rows.length} propiedades · página {page}/{totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
