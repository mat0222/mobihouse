import { useState } from 'react'
import { PropertyMapView } from '../components/PropertyMapView'
import { useProperties } from '../contexts/PropertiesContext'

export function MapPage() {
  const { properties } = useProperties()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = properties.find((p) => p.id === selectedId)

  return (
    <div className="flex min-w-0 flex-1 flex-col p-6">
      <h1 className="mb-5 text-2xl font-bold text-slate-900">Mapa Interactivo</h1>

      <div className="flex min-h-0 flex-1 gap-5">
        <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <PropertyMapView zoom={12} properties={properties} />
        </div>

        <aside className="w-72 shrink-0 overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Propiedades en el mapa
          </h2>
          <div className="space-y-2">
            {properties.map((property) => (
              <button
                key={property.id}
                type="button"
                onClick={() => setSelectedId(property.id)}
                className={`btn-animated w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedId === property.id
                    ? 'border-cyan-400 bg-cyan-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{property.title}</p>
                <p className="text-sm text-cyan-600">{property.price}</p>
                <p className="mt-1 text-xs text-slate-400">{property.badge}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-4 rounded-lg border border-slate-100 p-3">
              <img
                src={selected.image}
                alt={selected.title}
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
              <p className="font-bold text-slate-900">{selected.price}</p>
              <p className="text-sm text-slate-600">{selected.title}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
