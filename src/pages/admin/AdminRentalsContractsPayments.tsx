import { useAdminData } from '../../admin/AdminDataContext'
import {
  KpiCard,
  PageHeader,
  StatusBadge,
  formatMoney,
  formatDate,
} from '../../admin/components/ui'

export function AdminRentalsPage() {
  const { rentals } = useAdminData()
  const alerts = rentals.filter((r) => r.status === 'proximo_vencer' || r.status === 'vencido')

  return (
    <div>
      <PageHeader title="Alquileres" subtitle="Contratos de locación y alertas" />

      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
            >
              Contrato de {r.propertyTitle} — {r.tenantName}:{' '}
              {r.status === 'proximo_vencer' ? 'vence pronto' : 'vencido'} ({formatDate(r.endDate)})
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Propiedad</th>
              <th className="px-3 py-3">Inquilino</th>
              <th className="px-3 py-3">Propietario</th>
              <th className="px-3 py-3">Mensual</th>
              <th className="px-3 py-3">Depósito</th>
              <th className="px-3 py-3">Vigencia</th>
              <th className="px-3 py-3">Ajuste</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((r) => (
              <tr key={r.id} className="border-t border-slate-50">
                <td className="px-3 py-3 font-medium">{r.propertyTitle}</td>
                <td className="px-3 py-3">{r.tenantName}</td>
                <td className="px-3 py-3">{r.ownerName}</td>
                <td className="px-3 py-3">{formatMoney(r.monthlyPrice)}</td>
                <td className="px-3 py-3">{formatMoney(r.deposit)}</td>
                <td className="px-3 py-3 text-xs">
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </td>
                <td className="px-3 py-3 text-xs">
                  {r.adjustment} · {r.adjustmentIndex}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminContractsPage() {
  const { contracts, appendAudit } = useAdminData()

  return (
    <div>
      <PageHeader
        title="Contratos"
        subtitle="Reservas, alquileres y compraventas"
        actions={
          <button type="button" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
            Nuevo contrato
          </button>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Número</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Propiedad</th>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Vigencia</th>
              <th className="px-3 py-3">Importe</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="border-t border-slate-50">
                <td className="px-3 py-3 font-mono text-xs">{c.number}</td>
                <td className="px-3 py-3 capitalize">{c.type}</td>
                <td className="px-3 py-3">{c.propertyTitle}</td>
                <td className="px-3 py-3">{c.clientName}</td>
                <td className="px-3 py-3 text-xs">
                  {formatDate(c.startDate)} → {formatDate(c.endDate)}
                </td>
                <td className="px-3 py-3">{formatMoney(c.amount)}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs">Ver</button>
                    <button
                      type="button"
                      className="rounded bg-cyan-50 px-2 py-1 text-xs text-cyan-800"
                      onClick={() => {
                        appendAudit('Admin', 'descargó PDF', c.number)
                        alert(`Demo: descarga PDF de ${c.number}`)
                      }}
                    >
                      PDF
                    </button>
                    <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs">Firmar</button>
                    <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs">Renovar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminPaymentsPage() {
  const { payments } = useAdminData()
  const paid = payments.filter((p) => p.status === 'pagado').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0)
  const overdue = payments.filter((p) => p.status === 'vencido').reduce((s, p) => s + p.amount, 0)
  const commissions = Math.round(paid * 0.03)

  return (
    <div>
      <PageHeader title="Pagos" subtitle="Cobros, comisiones y estados" />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Ingresos cobrados" value={formatMoney(paid)} accent="emerald" />
        <KpiCard label="Pendientes" value={formatMoney(pending)} accent="amber" />
        <KpiCard label="Vencidos" value={formatMoney(overdue)} accent="rose" />
        <KpiCard label="Comisiones est." value={formatMoney(commissions)} accent="violet" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Propiedad</th>
              <th className="px-3 py-3">Concepto</th>
              <th className="px-3 py-3">Importe</th>
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Medio</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-50">
                <td className="px-3 py-3">{p.clientName}</td>
                <td className="px-3 py-3">{p.propertyTitle}</td>
                <td className="px-3 py-3">{p.concept}</td>
                <td className="px-3 py-3 font-semibold">{formatMoney(p.amount)}</td>
                <td className="px-3 py-3 text-xs">{formatDate(p.date)}</td>
                <td className="px-3 py-3">{p.method}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
