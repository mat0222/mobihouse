import { useAdminData } from '../../admin/AdminDataContext'
import { PageHeader, StatusBadge, formatDate } from '../../admin/components/ui'

export function AdminPublicationsPage() {
  const { publications, appendActivity } = useAdminData()

  return (
    <div>
      <PageHeader
        title="Publicaciones"
        subtitle="Canales y performance de cada propiedad"
        actions={
          <button type="button" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
            Nueva publicación
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {publications.map((p) => (
          <article key={p.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-slate-600">
                {p.channel}
              </span>
              <StatusBadge status={p.status} />
            </div>
            <h3 className="font-semibold text-slate-900">{p.propertyTitle}</h3>
            <p className="mt-1 text-xs text-slate-500">Actualizado {formatDate(p.updatedAt)}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-bold text-slate-900">{p.views}</p>
                <p className="text-slate-500">vistas</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-bold text-slate-900">{p.favorites}</p>
                <p className="text-slate-500">favoritos</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-bold text-slate-900">{p.inquiries}</p>
                <p className="text-slate-500">consultas</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs">Editar</button>
              <button
                type="button"
                className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800"
                onClick={() => appendActivity(`Publicación pausada — ${p.propertyTitle}`, 'publicacion')}
              >
                Pausar
              </button>
              <button
                type="button"
                className="rounded bg-cyan-50 px-2 py-1 text-xs text-cyan-800"
                onClick={() => {
                  if (p.url) navigator.clipboard?.writeText(p.url)
                  alert(p.url ? 'Enlace copiado' : 'Sin enlace')
                }}
              >
                Copiar enlace
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
