import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { PropertyCard } from '../components/PropertyCard'
import { useProperties } from '../contexts/PropertiesContext'
import { usePropertyFilters } from '../hooks/usePropertyFilters'

export function PropertiesPage() {
  const location = useLocation()
  const { properties, loading, error } = useProperties()
  const { filters, setFilters, filtered } = usePropertyFilters(properties)

  useEffect(() => {
    const search = (location.state as { search?: string } | null)?.search
    if (search) {
      setFilters((prev) => ({ ...prev, search }))
    }
  }, [location.state, setFilters])

  return (
    <main className="relative min-w-0 flex-1 overflow-y-auto p-6">
      <h1 className="mb-5 text-2xl font-bold text-slate-900">
        Explorar Propiedades Disponibles
      </h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">Cargando propiedades desde Firebase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">No hay propiedades que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  )
}
