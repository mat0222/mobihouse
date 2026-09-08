import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import {
  PageHeader,
  StatusBadge,
  formatDate,
  formatMoney,
} from '../../admin/components/ui'
import { CLIENT_STATUS_LABELS, type ClientStatus } from '../../admin/types'

export function AdminClientsPage() {
  const { clients } = useAdminData()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')

  const rows = useMemo(
    () =>
      clients.filter((c) => {
        const name = `${c.firstName} ${c.lastName}`.toLowerCase()
        const q = search.toLowerCase()
        return (
          (!q || name.includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) &&
          (status === 'all' || c.status === status) &&
          (type === 'all' || c.type === type)
        )
      }),
    [clients, search, status, type],
  )

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="CRM inmobiliario — seguimiento comercial"
        actions={
          <button type="button" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
            Nuevo cliente
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar nombre, email, ID..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Todos los estados</option>
          {Object.entries(CLIENT_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Todos los tipos</option>
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
          <option value="inquilino">Inquilino</option>
          <option value="propietario">Propietario</option>
          <option value="inversor">Inversor</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Contacto</th>
              <th className="px-3 py-3">Presupuesto</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Próximo contacto</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-slate-50">
                <td className="px-3 py-3">
                  <p className="font-medium text-slate-900">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-slate-500">{c.id} · DNI {c.dni}</p>
                </td>
                <td className="px-3 py-3 capitalize">{c.type}</td>
                <td className="px-3 py-3">
                  <p>{c.email}</p>
                  <p className="text-xs text-slate-500">{c.phone}</p>
                </td>
                <td className="px-3 py-3 text-xs">
                  {c.budgetMax > 0
                    ? `${formatMoney(c.budgetMin)} – ${formatMoney(c.budgetMax)}`
                    : '—'}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={c.status} label={CLIENT_STATUS_LABELS[c.status as ClientStatus]} />
                </td>
                <td className="px-3 py-3 text-xs">{formatDate(c.nextContact)}</td>
                <td className="px-3 py-3">
                  <Link to={`/admin/clientes/${c.id}`} className="text-xs font-semibold text-cyan-700 hover:underline">
                    Ver ficha
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminClientDetailPage() {
  const { id } = useParams()
  const { clients, visits, inquiries, sales, users } = useAdminData()
  const client = clients.find((c) => c.id === id)
  if (!client) return <Navigate to="/admin/clientes" replace />
  const agent = users.find((u) => u.id === client.agentId)

  return (
    <div>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={`${client.id} · ${client.type}`}
        actions={
          <Link to="/admin/clientes" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            Volver
          </Link>
        }
      />

      <div className="mb-4">
        <StatusBadge status={client.status} label={CLIENT_STATUS_LABELS[client.status]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Información</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <p><span className="text-slate-500">DNI:</span> {client.dni}</p>
            <p><span className="text-slate-500">Email:</span> {client.email}</p>
            <p><span className="text-slate-500">Teléfono:</span> {client.phone}</p>
            <p><span className="text-slate-500">Dirección:</span> {client.address}</p>
            <p><span className="text-slate-500">Nacimiento:</span> {client.birthDate}</p>
            <p><span className="text-slate-500">Agente:</span> {agent?.name ?? '—'}</p>
          </div>
          <h2 className="mb-2 mt-5 text-sm font-semibold">Preferencias</h2>
          <p className="text-sm text-slate-700">Busca: {client.seeking.join(', ') || '—'}</p>
          <p className="text-sm text-slate-700">Operación: {client.operation}</p>
          <p className="text-sm text-slate-700">
            Presupuesto:{' '}
            {client.budgetMax
              ? `${formatMoney(client.budgetMin)} – ${formatMoney(client.budgetMax)}`
              : '—'}
          </p>
          <p className="text-sm text-slate-700">Zonas: {client.locations.join(', ')}</p>
          <p className="mt-3 text-sm text-slate-600">{client.notes}</p>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Seguimiento</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Primera consulta: {formatDate(client.firstContact)}</li>
            <li>Último contacto: {formatDate(client.lastContact)}</li>
            <li>Próximo: {formatDate(client.nextContact)}</li>
          </ul>
          <h2 className="mb-2 mt-5 text-sm font-semibold">Timeline</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {inquiries.filter((i) => i.clientId === client.id).map((i) => (
              <li key={i.id}>Consulta · {i.propertyTitle}</li>
            ))}
            {visits.filter((v) => v.clientId === client.id).map((v) => (
              <li key={v.id}>Visita · {formatDate(v.datetime)} · {v.propertyTitle}</li>
            ))}
            {sales.filter((s) => s.buyerId === client.id).map((s) => (
              <li key={s.id}>Venta · {s.stage} · {formatMoney(s.price)}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
