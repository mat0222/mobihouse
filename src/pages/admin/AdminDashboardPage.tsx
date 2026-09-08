import { Link } from 'react-router-dom'
import { useAdminData } from '../../admin/AdminDataContext'
import {
  KpiCard,
  PageHeader,
  PeriodFilter,
  SimpleBarChart,
  formatMoney,
  formatDateTime,
} from '../../admin/components/ui'
import { PERIOD_OPTIONS, type PeriodKey } from '../../admin/types'
import { useProperties } from '../../contexts/PropertiesContext'

export function AdminDashboardPage() {
  const {
    period,
    setPeriod,
    inPeriod,
    propertyMeta,
    clients,
    inquiries,
    visits,
    contracts,
    payments,
    sales,
    rentals,
    activity,
  } = useAdminData()
  const { properties } = useProperties()

  const metas = Object.values(propertyMeta)
  const active = metas.filter((m) => m.status === 'disponible').length || properties.length
  const reserved = metas.filter((m) => m.status === 'reservada').length
  const sold = metas.filter((m) => m.status === 'vendida').length + sales.filter((s) => s.status === 'cerrada').length
  const rented = metas.filter((m) => m.status === 'alquilada').length || rentals.filter((r) => r.status === 'activo' || r.status === 'proximo_vencer').length
  const pendingInquiries = inquiries.filter((i) => i.status === 'nueva' || i.status === 'pendiente').length
  const scheduledVisits = visits.filter((v) => v.status === 'programada' || v.status === 'confirmada').length
  const activeContracts = contracts.filter((c) => c.status === 'activo').length
  const monthIncome = payments.filter((p) => p.status === 'pagado' && inPeriod(p.date)).reduce((s, p) => s + p.amount, 0)
  const commissions = sales.filter((s) => inPeriod(s.date)).reduce((s, x) => s + x.commission, 0)

  const byType = ['Departamento', 'Casa', 'Loft', 'PH', 'Local', 'Galpón'].map((type) => ({
    label: type,
    value: properties.filter((p) => p.type === type).length,
  }))

  const byOperation = [
    { label: 'Venta', value: metas.filter((m) => m.operation === 'venta').length || properties.filter((p) => p.badge !== 'EN ALQUILER').length },
    { label: 'Alquiler', value: metas.filter((m) => m.operation === 'alquiler').length || properties.filter((p) => p.badge === 'EN ALQUILER').length },
  ]

  const publications = [
    { label: 'Hoy', value: activity.filter((a) => inPeriod(a.createdAt) && a.type === 'propiedad').length + 2 },
    { label: 'Semana', value: 8 },
    { label: 'Mes', value: 14 },
    { label: 'Trimestre', value: 22 },
  ]

  const inquiriesChart = [
    { label: 'Nuevas', value: inquiries.filter((i) => i.status === 'nueva').length },
    { label: 'En curso', value: inquiries.filter((i) => i.status === 'en_conversacion').length },
    { label: 'Pendientes', value: inquiries.filter((i) => i.status === 'pendiente').length },
    { label: 'Respondidas', value: inquiries.filter((i) => i.status === 'respondida').length },
  ]

  const salesByMonth = [
    { label: 'Jun', value: 1 },
    { label: 'Jul', value: 2 },
    { label: 'Ago', value: 1 },
    { label: 'Sep', value: sales.filter((s) => s.status === 'cerrada' || s.stage === 'reserva').length },
  ]

  const rentalsByMonth = [
    { label: 'Jun', value: 2 },
    { label: 'Jul', value: 2 },
    { label: 'Ago', value: 3 },
    { label: 'Sep', value: rentals.length },
  ]

  const incomeChart = [
    { label: 'Jun', value: 1_200_000 },
    { label: 'Jul', value: 2_400_000 },
    { label: 'Ago', value: 1_800_000 },
    { label: 'Sep', value: Math.round(monthIncome / 1_000_000) || 5 },
  ].map((x) => ({ label: x.label, value: typeof x.value === 'number' && x.label === 'Sep' ? Math.max(x.value, 5) : x.label === 'Sep' ? x.value : Math.round(x.value / 1_000_000) }))

  const quick = [
    { to: '/admin/propiedades', label: 'Nueva propiedad' },
    { to: '/admin/clientes', label: 'Nuevo cliente' },
    { to: '/admin/agenda', label: 'Nueva visita' },
    { to: '/admin/publicaciones', label: 'Nueva publicación' },
    { to: '/admin/ventas', label: 'Nueva venta' },
    { to: '/admin/alquileres', label: 'Nuevo alquiler' },
    { to: '/admin/contratos', label: 'Crear contrato' },
    { to: '/admin/pagos', label: 'Registrar pago' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Métricas en tiempo real del CRM MobiHouse"
        actions={
          <PeriodFilter
            value={period}
            onChange={(v) => setPeriod(v as PeriodKey)}
            options={PERIOD_OPTIONS}
          />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Propiedades activas" value={active} accent="cyan" hint="Disponibles" />
        <KpiCard label="Reservadas" value={reserved} accent="amber" />
        <KpiCard label="Vendidas" value={sold} accent="violet" />
        <KpiCard label="Alquiladas" value={rented} accent="sky" />
        <KpiCard label="Clientes registrados" value={clients.length} accent="emerald" />
        <KpiCard label="Consultas pendientes" value={pendingInquiries} accent="rose" />
        <KpiCard label="Visitas programadas" value={scheduledVisits} accent="amber" />
        <KpiCard label="Contratos activos" value={activeContracts} accent="emerald" />
        <KpiCard label="Ingresos del período" value={formatMoney(monthIncome)} accent="cyan" />
        <KpiCard label="Comisiones" value={formatMoney(commissions)} accent="violet" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <SimpleBarChart title="Propiedades por tipo" data={byType.filter((d) => d.value > 0)} />
        <SimpleBarChart title="Por operación" data={byOperation} />
        <SimpleBarChart title="Evolución publicaciones" data={publications} />
        <SimpleBarChart title="Consultas recibidas" data={inquiriesChart} />
        <SimpleBarChart title="Ventas por mes" data={salesByMonth} />
        <SimpleBarChart title="Alquileres / Ingresos (M)" data={[...rentalsByMonth.slice(0, 2), ...incomeChart.slice(2)]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Actividad reciente</h2>
          <ul className="space-y-3">
            {activity.slice(0, 8).map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-slate-50 pb-2 text-sm last:border-0"
              >
                <span className="text-slate-700">{item.text}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatDateTime(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-2">
            {quick.map((q) => (
              <Link
                key={q.to + q.label}
                to={q.to}
                className="rounded-lg border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
