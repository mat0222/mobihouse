import { useState } from 'react'
import { useAdminData } from '../../admin/AdminDataContext'
import {
  KpiCard,
  PageHeader,
  downloadCsv,
  formatMoney,
} from '../../admin/components/ui'
import { useProperties } from '../../contexts/PropertiesContext'
import { PERIOD_OPTIONS, type PeriodKey } from '../../admin/types'
import { PeriodFilter } from '../../admin/components/ui'

export function AdminReportsPage() {
  const { sales, rentals, inquiries, visits, payments, period, setPeriod, propertyMeta, publications } =
    useAdminData()
  const { properties } = useProperties()
  const [agent, setAgent] = useState('all')

  const sold = Object.values(propertyMeta).filter((m) => m.status === 'vendida').length
  const rented = Object.values(propertyMeta).filter((m) => m.status === 'alquilada').length
  const topViews = [...publications].sort((a, b) => b.views - a.views)[0]

  const exportCsv = () => {
    downloadCsv('mobihouse-reportes.csv', [
      ['Métrica', 'Valor'],
      ['Propiedades activas', String(properties.length)],
      ['Vendidas', String(sold)],
      ['Alquiladas', String(rented)],
      ['Ventas', String(sales.length)],
      ['Alquileres', String(rentals.length)],
      ['Consultas', String(inquiries.length)],
      ['Visitas', String(visits.length)],
      ['Ingresos pagados', String(payments.filter((p) => p.status === 'pagado').reduce((s, p) => s + p.amount, 0))],
    ])
  }

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Comercial, propiedades y financiero"
        actions={
          <div className="flex flex-wrap gap-2">
            <PeriodFilter
              value={period}
              onChange={(v) => setPeriod(v as PeriodKey)}
              options={PERIOD_OPTIONS}
            />
            <button type="button" onClick={exportCsv} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium">
              Exportar CSV
            </button>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium" onClick={() => alert('Demo PDF')}>
              Exportar PDF
            </button>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium" onClick={exportCsv}>
              Excel
            </button>
          </div>
        }
      />

      <div className="mb-4">
        <select
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">Todos los agentes</option>
          <option value="U-3">Carlos Gómez</option>
          <option value="U-1">Andrés García</option>
        </select>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-800">Propiedades</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Activas" value={properties.length} />
        <KpiCard label="Vendidas" value={sold} accent="violet" />
        <KpiCard label="Alquiladas" value={rented} accent="sky" />
        <KpiCard label="Más vistas" value={topViews?.views ?? 0} hint={topViews?.propertyTitle} />
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-800">Comercial</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Ventas" value={sales.length} accent="emerald" />
        <KpiCard label="Alquileres" value={rentals.length} accent="cyan" />
        <KpiCard label="Consultas" value={inquiries.length} accent="amber" />
        <KpiCard label="Visitas" value={visits.length} accent="rose" />
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-800">Financiero</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Ingresos"
          value={formatMoney(payments.filter((p) => p.status === 'pagado').reduce((s, p) => s + p.amount, 0))}
          accent="emerald"
        />
        <KpiCard
          label="Comisiones"
          value={formatMoney(sales.reduce((s, x) => s + x.commission, 0))}
          accent="violet"
        />
        <KpiCard
          label="Pendientes"
          value={formatMoney(payments.filter((p) => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0))}
          accent="amber"
        />
        <KpiCard
          label="Morosidad"
          value={formatMoney(payments.filter((p) => p.status === 'vencido').reduce((s, p) => s + p.amount, 0))}
          accent="rose"
        />
      </div>
    </div>
  )
}
