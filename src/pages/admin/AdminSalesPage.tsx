import { useAdminData } from '../../admin/AdminDataContext'
import {
  PageHeader,
  StatusBadge,
  formatMoney,
  formatDate,
} from '../../admin/components/ui'
import { SALE_STAGE_LABELS, type SaleStage } from '../../admin/types'

const stages: SaleStage[] = [
  'consulta',
  'visita',
  'oferta',
  'negociacion',
  'reserva',
  'venta',
]

export function AdminSalesPage() {
  const { sales, updateSaleStage } = useAdminData()

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle="Pipeline comercial tipo embudo"
        actions={
          <button type="button" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
            Nueva venta
          </button>
        }
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const cards = sales.filter((s) => s.stage === stage)
          return (
            <div key={stage} className="w-72 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">{SALE_STAGE_LABELS[stage]}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600">
                  {cards.length}
                </span>
              </div>
              <div className="space-y-2">
                {cards.map((s) => (
                  <article key={s.id} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{s.propertyTitle}</p>
                    <p className="text-xs text-slate-500">{s.buyerName}</p>
                    <p className="mt-2 text-sm font-bold text-cyan-700">{formatMoney(s.price)}</p>
                    <p className="text-[11px] text-slate-500">
                      Comisión {formatMoney(s.commission)} · Seña {formatMoney(s.deposit)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Saldo {formatMoney(s.balance)} · {formatDate(s.date)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StatusBadge status={s.status} />
                      <select
                        className="rounded border border-slate-200 text-[11px]"
                        value={s.stage}
                        onChange={(e) => updateSaleStage(s.id, e.target.value as SaleStage)}
                      >
                        {stages.map((st) => (
                          <option key={st} value={st}>
                            {SALE_STAGE_LABELS[st]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
