import { useState } from 'react'
import { useAdminData } from '../../admin/AdminDataContext'
import {
  PageHeader,
  StatusBadge,
  formatDateTime,
} from '../../admin/components/ui'
import { PERMISSIONS } from '../../admin/types'

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrador',
  admin: 'Administrador',
  agente: 'Agente inmobiliario',
  contador: 'Contador',
  recepcion: 'Recepción',
}

export function AdminUsersPage() {
  const { users } = useAdminData()
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? '')
  const selected = users.find((u) => u.id === selectedId) ?? users[0]

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Roles y permisos del equipo" />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Nombre</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Rol</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`cursor-pointer border-t border-slate-50 ${selected?.id === u.id ? 'bg-cyan-50' : ''}`}
                  onClick={() => setSelectedId(u.id)}
                >
                  <td className="px-3 py-3 font-medium">{u.name}</td>
                  <td className="px-3 py-3">{u.email}</td>
                  <td className="px-3 py-3">{roleLabels[u.role] ?? u.role}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-3 py-3 text-xs">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <aside className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{selected.name}</h2>
            <p className="text-xs text-slate-500">{roleLabels[selected.role]}</p>
            <h3 className="mb-2 mt-4 text-xs font-semibold uppercase text-slate-500">Permisos</h3>
            <ul className="space-y-2">
              {PERMISSIONS.map((perm) => (
                <li key={perm} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selected.permissions.includes(perm)}
                    readOnly
                    className="rounded border-slate-300"
                  />
                  {perm.replaceAll('_', ' ')}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}

export function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdminData()

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        subtitle="Centro de alertas del CRM"
        actions={
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
          >
            Marcar todas como leídas
          </button>
        }
      />
      <div className="space-y-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => markNotificationRead(n.id)}
            className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left shadow-sm ${
              n.read ? 'border-slate-100 bg-white' : 'border-cyan-100 bg-cyan-50'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{n.title}</p>
              <p className="text-sm text-slate-600">{n.body}</p>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function AdminConfigPage() {
  const { company, updateCompany, resetDemoData, appendAudit } = useAdminData()
  const [form, setForm] = useState(company)

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Empresa, sistema y seguridad" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Empresa</h2>
          <div className="space-y-3">
            {(
              [
                ['name', 'Nombre'],
                ['phone', 'Teléfono'],
                ['email', 'Email'],
                ['address', 'Dirección'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block text-slate-600">{label}</span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white"
              onClick={() => {
                updateCompany(form)
                appendAudit('Admin', 'actualizó configuración', 'Empresa')
              }}
            >
              Guardar
            </button>
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              Guardar y continuar
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              onClick={() => setForm(company)}
            >
              Cancelar
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Sistema</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <label>
              <span className="mb-1 block text-slate-600">Moneda</span>
              <input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-slate-600">Formato fecha</span>
              <input
                value={form.dateFormat}
                onChange={(e) => setForm({ ...form, dateFormat: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-slate-600">Zona horaria</span>
              <input
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-slate-600">Idioma</span>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <h2 className="mb-2 mt-5 text-sm font-semibold">Seguridad</h2>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>Cambio de contraseña — vía Firebase Auth</li>
            <li>Sesiones activas — demo</li>
            <li>2FA — próximo release</li>
            <li>Registro de accesos — ver Auditoría</li>
          </ul>
          <button
            type="button"
            className="mt-4 rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
            onClick={() => {
              if (confirm('¿Resetear datos demo del CRM?')) resetDemoData()
            }}
          >
            Resetear datos demo
          </button>
        </section>
      </div>
    </div>
  )
}

export function AdminAuditPage() {
  const { audit } = useAdminData()

  return (
    <div>
      <PageHeader title="Auditoría / Actividad" subtitle="Quién hizo qué y cuándo" />
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <ul>
          {audit.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-50 px-4 py-3 text-sm last:border-0"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {e.actor} {e.action}
                </p>
                <p className="text-slate-600">{e.target}</p>
              </div>
              <span className="text-[11px] text-slate-400">{formatDateTime(e.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
